import { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

// Expanded Port Database matching the UI Panel
const PORTS_DATA = [
  // India (Discharge)
  { name: 'Paradip Port', country: 'India', lat: 20.26, lng: 86.67, berths: 14, depth: '17.1m', maxLOA: '300m' },
  { name: 'Visakhapatnam', country: 'India', lat: 17.69, lng: 83.29, berths: 24, depth: '16.5m', maxLOA: '300m' },
  { name: 'Dhamra', country: 'India', lat: 20.82, lng: 86.97, berths: 5, depth: '18.0m', maxLOA: '320m' },
  { name: 'Haldia', country: 'India', lat: 22.02, lng: 88.06, berths: 10, depth: '8.5m', maxLOA: '230m' },
  { name: 'Chennai Port', country: 'India', lat: 13.08, lng: 80.29, berths: 14, depth: '15.5m', maxLOA: '320m' },
  { name: 'Mundra Port', country: 'India', lat: 22.73, lng: 69.73, berths: 24, depth: '16.0m', maxLOA: '350m' },
  { name: 'JNPT', country: 'India', lat: 18.95, lng: 72.95, berths: 12, depth: '15.0m', maxLOA: '340m' },
  { name: 'Kandla Port', country: 'India', lat: 23.03, lng: 70.21, berths: 16, depth: '14.5m', maxLOA: '300m' },
  { name: 'Cochin Port', country: 'India', lat: 9.96, lng: 76.26, berths: 8, depth: '13.5m', maxLOA: '300m' },

  // Australia (Origin)
  { name: 'Hay Point', country: 'Australia', lat: -21.26, lng: 149.30, berths: 6, depth: '16.5m', maxLOA: '320m' },
  { name: 'Port Hedland', country: 'Australia', lat: -20.31, lng: 118.57, berths: 19, depth: '19.0m', maxLOA: '330m' },
  { name: 'Newcastle', country: 'Australia', lat: -32.92, lng: 151.78, berths: 9, depth: '15.2m', maxLOA: '300m' },
  { name: 'Gladstone', country: 'Australia', lat: -23.82, lng: 151.25, berths: 8, depth: '16.3m', maxLOA: '320m' },
  { name: 'Abbot Point', country: 'Australia', lat: -19.88, lng: 148.08, berths: 2, depth: '19.3m', maxLOA: '320m' },

  // Indonesia (Origin)
  { name: 'Balikpapan', country: 'Indonesia', lat: -1.26, lng: 116.82, berths: 7, depth: '14.0m', maxLOA: '250m' },
  { name: 'Tanjung Bara', country: 'Indonesia', lat: 0.53, lng: 117.65, berths: 3, depth: '17.5m', maxLOA: '310m' },
  { name: 'Taboneo', country: 'Indonesia', lat: -3.68, lng: 114.46, berths: 0, depth: '20.0m', maxLOA: '330m' }, // Anchorage

  // Americas (Origin)
  { name: 'Norfolk', country: 'United States', lat: 36.85, lng: -76.28, berths: 12, depth: '15.2m', maxLOA: '350m' },
  { name: 'Vancouver', country: 'Canada', lat: 49.28, lng: -123.12, berths: 10, depth: '15.5m', maxLOA: '300m' },
  { name: 'Tubarao', country: 'Brazil', lat: -20.28, lng: -40.23, berths: 4, depth: '22.5m', maxLOA: '365m' },

  // Africa & Russia (Origin)
  { name: 'Maputo', country: 'Mozambique', lat: -25.96, lng: 32.57, berths: 16, depth: '14.3m', maxLOA: '260m' },
  { name: 'Richards Bay', country: 'South Africa', lat: -28.79, lng: 32.03, berths: 6, depth: '19.0m', maxLOA: '350m' },
  { name: 'Vostochny', country: 'Russia', lat: 42.73, lng: 133.08, berths: 8, depth: '16.5m', maxLOA: '300m' },
  { name: 'Ust-Luga', country: 'Russia', lat: 59.66, lng: 28.23, berths: 6, depth: '16.0m', maxLOA: '300m' }
];

export default function WorldMap() {
  const globeRef = useRef<any>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current;
      globe.pointOfView({ lat: 10, lng: 80, altitude: 2 }, 2000);

      const CLOUDS_IMG_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png';
      const CLOUDS_ALT = 0.004; 
      const CLOUDS_ROTATION_SPEED = -0.006; 

      new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
          new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true, opacity: 0.8 })
        );
        globe.scene().add(clouds);

        (function rotateClouds() {
          clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
          requestAnimationFrame(rotateClouds);
        })();
      });
    }
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center cursor-move bg-[#e6e9ee]">
      <Globe
        ref={globeRef}
        width={windowSize.width}
        height={windowSize.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg" 
        backgroundColor="rgba(0,0,0,0)"
        
        // --- POINTS ---
        pointsData={PORTS_DATA}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#22d3ee'} 
        pointAltitude={0.015} // Lifted above the clouds
        pointRadius={0.4}
        pointsMerge={false}

        // --- RINGS ---
        ringsData={PORTS_DATA}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => '#22d3ee'}
        ringMaxRadius={3}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1500}
        ringAltitude={0.015} // LIFTED ABOVE THE CLOUDS TO RESTORE BLINKING

        // --- TOOLTIP ---
        pointLabel={(d: any) => `
          <div style="
            background: rgba(15, 23, 42, 0.85); 
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.15); 
            padding: 14px; 
            border-radius: 12px; 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            color: white; 
            min-width: 220px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          ">
            <div style="font-size: 15px; font-weight: 600; margin-bottom: 2px; color: #22d3ee;">${d.name}</div>
            <div style="font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              ${d.country}
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
              <span style="color: #cbd5e1;">Available Berths</span> 
              <strong style="color: #fff;">${d.berths}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
              <span style="color: #cbd5e1;">Max Depth</span> 
              <strong style="color: #fff;">${d.depth}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span style="color: #cbd5e1;">Max LOA</span> 
              <strong style="color: #fff;">${d.maxLOA}</strong>
            </div>
          </div>
        `}
      />
    </div>
  );
}