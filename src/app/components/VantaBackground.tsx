"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import WAVES from "vanta/dist/vanta.waves.min.js";

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !vantaRef.current) return;
    
    const effect = WAVES({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: false,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x0e0000,
      shininess: 25,
      waveHeight: 18,
      waveSpeed: 0.55,
      zoom: 0.88,
    });
    
    return () => { if (effect) effect.destroy(); };
  }, []);

  return <div ref={vantaRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

