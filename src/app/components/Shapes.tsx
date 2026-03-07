"use client";
export function Ring({ size = 180, color = "rgba(239,68,68,0.22)", duration = "10s", reverse = false, style }: {
  size?: number; color?: string; duration?: string; reverse?: boolean; style?: React.CSSProperties;
}) {
  return (
    <div className="pointer-events-none absolute" style={{ perspective: "500px", ...style, zIndex: 2 }}>
      <div style={{
        width: size, height: size,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        boxShadow: `0 0 24px ${color}`,
        animation: `${reverse ? "spin-ring-rev" : "spin-ring"} ${duration} linear infinite`,
      }} />
    </div>
  );
}

export function Triangle({ color = "rgba(139,92,246,0.32)", size = 88, style }: {
  color?: string; size?: number; style?: React.CSSProperties;
}) {
  return (
    <div className="pointer-events-none absolute" style={{ ...style, zIndex: 2 }}>
      <svg width={size} height={Math.round(size * 0.866)} viewBox="0 0 88 76" fill="none"
        style={{ animation: "tri-float 9s ease-in-out infinite" }}>
        <path d="M44 4 L85 72 L3 72 Z"
          stroke={color} strokeWidth="1.5" fill={`${color.replace(/[\d.]+\)$/, "0.06)")}`}
          strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Cube({ color = "rgba(251,191,36,0.28)", size = 72, style }: {
  color?: string; size?: number; style?: React.CSSProperties;
}) {
  return (
    <div className="pointer-events-none absolute" style={{ ...style, zIndex: 2 }}>
      <div style={{
        width: size, height: size,
        border: `1.5px dashed ${color}`,
        borderRadius: 14,
        animation: "float3d 8s ease-in-out infinite",
        transform: "rotateX(25deg) rotateZ(28deg)",
        boxShadow: `0 0 16px ${color}`,
      }} />
    </div>
  );
}

export function Diamond({ color = "rgba(16,185,129,0.3)", size = 70, style }: {
  color?: string; size?: number; style?: React.CSSProperties;
}) {
  return (
    <div className="pointer-events-none absolute" style={{ ...style, zIndex: 2 }}>
      <div style={{
        width: size * 0.7,
        height: size,
        background: `linear-gradient(135deg, ${color}, transparent)`,
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        animation: "float3d 10s ease-in-out infinite",
        opacity: 0.4,
      }} />
    </div>
  );
}

export function HexRing({ color = "rgba(6,182,212,0.3)", size = 80, style }: {
  color?: string; size?: number; style?: React.CSSProperties;
}) {
  return (
    <div className="pointer-events-none absolute" style={{ ...style, zIndex: 2 }}>
      <div style={{
        width: size,
        height: size,
        border: `1.5px solid ${color}`,
        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        animation: "spin-ring 20s linear infinite",
        boxShadow: `0 0 20px ${color}`,
      }} />
    </div>
  );
}

