import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNzdkN2Y2Zi1kN2Q1LTQ1YWQtOWFiNy0yZTEyZTE1MjU3YmYiLCJpZCI6MzA0MDYsImlhdCI6MTcyOTY1NTk3NX0.your-cesium-token-here'; // Get free at cesium.com/ion

export default function Globe() {
  const viewerRef = useRef(null);

  useEffect(() => {
    const viewer = new Cesium.Viewer(viewerRef.current, {
      terrainProvider: Cesium.createWorldTerrain(),
      baseLayerPicker: false,
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      vrButton: false,
      imageryProvider: new Cesium.OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/'
      })
    });

    // Start with spinning Earth
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(0, 20, 3000000),
      orientation: {
        heading: 0,
        pitch: -0.2,
        roll: 0
      }
    });

    // Continuous spin
    const spin = () => {
      viewer.camera.rotateRight(0.0005);
      requestAnimationFrame(spin);
    };
    spin();

    // 8-second zoom to Pinal County
    setTimeout(() => {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-111.3, 32.8, 100000),
        orientation: {
          heading: 0,
          pitch: -0.5,
          roll: 0
        },
        duration: 8
      });
    }, 2000);

    // Fake pins (real Pinal later)
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-111.55, 32.9, 0),
      point: { pixelSize: 10, color: Cesium.Color.RED }
    });
    viewer.entities.add({
      position: Cesian.Cartesian3.fromDegrees(-111.62, 32.75, 0),
      point: { pixelSize: 8, color: Cesium.Color.ORANGE }
    });

    return () => viewer.destroy();
  }, []);

  return <div ref={viewerRef} style={{ width: '100vw', height: '100vh' }} />;
}
