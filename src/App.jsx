import React, { useEffect, useRef } from 'react';

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spinning Earth circle
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 200, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e3a8a'; // Blue Earth
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      angle += 0.02;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Pinal County', 0, 250);
      ctx.restore();

      requestAnimationFrame(draw);
    };
    draw();

    // Fade loader (static HTML will hide after 3 seconds via CSS, but this ensures)
    setTimeout(() => {
      canvas.style.opacity = '1';
    }, 3000);

  }, []);

  return (
    <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ opacity: 0, transition: 'opacity 1s' }} />
  );
}
