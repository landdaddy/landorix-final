import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFuZGRhZGR5IiwiYSI6ImNtaTc3bHRpdTAyOG8ya3EweW9yMnV0cTcifQ.oT4tCEi4I9yZiGgMKh7vOA';

const PINAL_CENTER = [-111.3, 32.8];

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: PINAL_CENTER,
      zoom: 11,
      pitch: 0,
      bearing: 0
    });

    map.current.on('load', () => {
      // Fake pins (real Pinal vacant land next)
      const fakeParcels = [
        { lng: -111.55, lat: 32.9, acres: 8.1, potential: "VERY HIGH" },
        { lng: -111.62, lat: 32.75, acres: 5.2, potential: "HIGH" }
      ];

      fakeParcels.forEach(p => {
        new mapboxgl.Marker({ color: p.potential === "VERY HIGH" ? '#ff006e' : '#ff6b00' })
          .setLngLat([p.lng, p.lat])
          .addTo(map.current);
      });
    });

  }, []);

  return <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />;
}
