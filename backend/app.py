from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json

app = Flask(__name__)

# Allow both your Railway frontend URL and your custom domain
allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "https://lucky-balance-production.up.railway.app,https://landorix.com"
)
CORS(app, origins=[origin.strip() for origin in allowed_origins.split(",")])

# Lazy database connection (no more crashes on startup)
def get_conn():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise RuntimeError("DATABASE_URL environment variable is not set")
    # Railway gives postgres:// → psycopg2 needs postgresql://
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    return psycopg2.connect(db_url)

@app.route("/")
def home():
    return jsonify({
        "message": "LANDORIX backend is live!",
        "parcels_endpoint": "/taxparcels",
        "status": "ready"
    })

@app.route("/taxparcels")
def taxparcels():
    bbox = request.args.get("bbox")
    search = request.args.get("search", "").strip()

    if not bbox:
        return jsonify({"error": "bbox parameter is required"}), 400

    try:
        west, south, east, north = map(float, bbox.split(","))
    except:
        return jsonify({"error": "Invalid bbox format"}), 400

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    sql = """
        SELECT parcel_id, owner_name, situs_addr, total_value, zoning, acres,
               ST_AsGeoJSON(geom) AS geometry
        FROM tax_parcels
        WHERE geom && ST_MakeEnvelope(%s, %s, %s, %s, 4326)
    """
    params = [west, south, east, north]

    if search:
        sql += " AND (parcel_id ILIKE %s OR owner_name ILIKE %s OR situs_addr ILIKE %s)"
        params.extend([f"%{search}%"] * 3)

    sql += " LIMIT 5000"

    cur.execute(sql, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    features = []
    for row in rows:
        geom = json.loads(row["geometry"]) if row["geometry"] else None
        if geom:
            features.append({
                "type": "Feature",
                "geometry": geom,
                "properties": {
                    "parcel_id": row["parcel_id"] or "",
                    "owner_name": row["owner_name"] or "",
                    "situs_addr": row["situs_addr"] or "",
                    "total_value": float(row["total_value"]) if row["total_value"] else 0,
                    "zoning": row["zoning"] or "",
                    "acres": round(row["acres"], 2) if row["acres"] else 0
                }
            })

    return jsonify({
        "type": "FeatureCollection",
        "features": features
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
