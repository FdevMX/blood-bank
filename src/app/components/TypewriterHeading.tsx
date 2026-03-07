"use client";
import { TypeAnimation } from "react-type-animation";

export function TypewriterHeading() {
  return (
    <TypeAnimation
      sequence={[
        "Bancos de Sangre",   2800,
        "Donantes de Vida",   2000,
        "Inventario Clínico", 2000,
        "Equipos Médicos",    2000,
      ]}
      speed={55}
      deletionSpeed={70}
      repeat={Infinity}
      className="text-transparent bg-clip-text"
      style={{
        background: "linear-gradient(90deg,#fca5a5,#ef4444,#fb923c,#fbbf24)",
        backgroundSize: "250% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "shimmer-text 4s linear infinite",
      }}
      cursor={true}
    />
  );
}

