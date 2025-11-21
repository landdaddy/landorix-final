from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from sqlalchemy import create_engine, text
import json

app = Flask(__name__)
CORS(app)

engine = create_engine(os.environ['DATABASE_URL'].replace('postgres://', 'postgresql://'))

@app.route('/taxparcels')
def taxparcels():
    bbox = request.args.get('bbox')
    search = request.args.get('search', '').strip()

    sql = "SELECT parcel_id, owner_name, situs_addr, total_value, zoning, acres, ST_AsGeoJSON(geometry) as geom FROM taxparcels WHERE 1=1"
    params = {}

    if bbox:
        w, s, e, n = map(float, bbox.split(','))
        sql += " AND geometry && ST_MakeEnvelope(:w, :s, :e, :n, 4326)"
        params.update(w=w, s=s, e=e, n=n)

    if search:
        sql += " AND (parcel_id ILIKE :s OR owner_name ILIKE :s OR situs_addr ILIKE :s)"
        params['s'] = f"%{search}%"

    sql += " LIMIT 2000"

    with engine.connect() as conn:
        rows = conn.execute(text(sql), params).fetchall()

    features = []
    for row in rows:
        if row.geom:
            geom = json.loads(row.geom)
            features.append({
                "type": "Feature",
                "geometry": geom,
                "properties": {
                    "parcel_id": row.parcel_id or "",
                    "owner_name": row.owner_name or "",
                    "situs_addr": row.situs_addr or "",
                    "total_value": row.total_value or 0,
                    "zoning": row.zoning or "",
                    "acres": round(row.acres, 2) if row.acres else 0
                }
            })

    return jsonify({"type": "FeatureCollection", "features": features})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
