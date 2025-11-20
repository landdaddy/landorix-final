import React, { useEffect, useState } from 'react';
import Globe from './Globe';

export default function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '4rem',
          letterSpacing: '0.3em',
          pointerEvents: 'none' // lets mouse through after fade
        }}>
          LANDORIX
          <div style={{
            marginTop: '40px',
            width: '80px',
            height: '80px',
            border: '4px solid rgba(255,255,255,0.2)',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
      <Globe />
    </>
  );
}
