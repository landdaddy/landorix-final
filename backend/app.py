from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from psycopg import connect
from psycopg.rows import dict_row

app = Flask(__name__)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "https://lucky-balance-production.up.railway.app,https://landorix.com")
CORS(app, origins=[o.strip() for o in CORS_ORIGINS.split(",")])

def get_conn():
    url = os.getenv("DATABASE_URL")
    if url and url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return connect(url)

@app.route("/")
def home():
    return jsonify({"message": "LANDORIX backend is live!", "status": "ready"})

@app.route("/taxparcels")
def taxparcels():
    bbox = request.args.get("bbox")
    if not bbox:
        return jsonify({"error": "bbox required"}), 400

    west, south, east, north = map(float, bbox.split(","))
    conn = get_conn()
    cur = conn.cursor(row_factory=dict_row)
    cur.execute("""
        SELECT parcel_id, owner_name, situs_addr, total_value, zoning, acres,
               ST_AsGeoJSON(geom) AS geometry
        FROM tax_parcels
        WHERE geom && ST_MakeEnvelope(%s, %s, %s, %s, 4326)
        LIMIT 5000
    """, [west, south, east, north])
    rows = cur.fetchall()
    conn.close()

    features = []
    for r in rows:
        if r["geometry"]:
            features.append({
                "type": "Feature",
                "geometry": json.loads(r["geometry"]),
                "properties": {
                    "parcel_id": r["parcel_id"] or "",
                    "  owner_name": r["owner_name"] or "",
                    "situs_addr": r["situs_addr"] or "",
                    "total_value": float(r["total_value"] or 0),
                    "zoning": r["zoning"] or "",
                    "acres": round(r["acres"] or 0, 2)
                }
            })

    return jsonify({"type": "FeatureCollection", "features": features})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
