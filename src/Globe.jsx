import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFuZGRhZGR5IiwiYSI6ImNtaTZ6ajRnMDA0MjIyanEzZGRja29qeDUifQ.pJlxJzTZCSuDbFbN8A-ZtQ'; // ← your new token

export default function Map() {
  const container = useRef(null);

  useEffect(() => {
    new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/mapbox/satellite-v9',   // instant satellite, no globe hang
      center: [-111.3, 32.8],
      zoom: 11,
      pitch: 0
    });
  }, []);

  return <div ref={container} style={{ width: '100vw', height: '100vh' }} />;
}
