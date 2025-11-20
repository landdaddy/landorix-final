import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Globe() {
  const mountRef = useRef(null);

useEffect(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  container.current.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const texture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const earth = new THREE.Mesh(geometry, material);
  scene.add(earth);

  camera.position.z = 15;

  const animate = () => {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    renderer.render(scene, camera);
  };
  animate();

  // 8-second zoom to Pinal (simulated)
  setTimeout(() => {
    camera.position.z = 8;
  }, 3000);

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    container.current.removeChild(renderer.domElement);
  };
}, []);

  return <div ref={container} style={{ width: '100vw', height: '100vh' }} />;
}
