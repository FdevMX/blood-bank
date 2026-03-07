"use client";
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => ({
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 70, density: { enable: true, width: 800 } },
      color: { value: ["#FF2A2A", "#FF7B7B", "#5C2B2B", "#10B981"] },
      opacity: { value: { min: 0.1, max: 0.4 }, random: true },
      size: { value: { min: 1, max: 4 } },
      move: {
        enable: true, speed: 0.6, direction: "none" as const,
        random: true, outModes: "out" as const
      },
      links: {
        enable: true, distance: 150,
        color: "#FF2A2A", opacity: 0.15, width: 1
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
      },
      modes: { 
        grab: { distance: 140, links: { opacity: 0.3 } },
        repulse: { distance: 100, duration: 0.4 } 
      }
    }
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
    />
  );
}
