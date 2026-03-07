import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Banco de Sangre — Sistema de Gestión";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #0d0000 0%, #3b0000 35%, #7f1d1d 75%, #991b1b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Círculo decorativo de fondo */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(220, 38, 38, 0.08)",
            border: "1px solid rgba(220, 38, 38, 0.15)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "rgba(220, 38, 38, 0.04)",
            border: "1px solid rgba(220, 38, 38, 0.08)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
          }}
        />

        {/* Ícono principal — gota de sangre SVG */}
        <svg
          width="110"
          height="130"
          viewBox="0 0 100 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 4 C50 4 8 58 8 80 C8 103 27 116 50 116 C73 116 92 103 92 80 C92 58 50 4 50 4 Z"
            fill="#EF4444"
            stroke="#FCA5A5"
            stroke-width="2"
          />
          <rect x="43" y="67" width="14" height="32" rx="3" fill="white" />
          <rect x="34" y="76" width="32" height="14" rx="3" fill="white" />
        </svg>

        {/* Título principal */}
        <div
          style={{
            color: "white",
            fontSize: 80,
            fontWeight: 800,
            marginTop: 28,
            letterSpacing: "-3px",
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          Banco de Sangre
        </div>

        {/* Subtítulo */}
        <div
          style={{
            color: "#FCA5A5",
            fontSize: 26,
            fontWeight: 500,
            marginTop: 18,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Sistema de Gestión Integral
        </div>

        {/* Separador */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#DC2626",
            borderRadius: 2,
            marginTop: 28,
          }}
        />

        {/* Descripción */}
        <div
          style={{
            color: "#9CA3AF",
            fontSize: 22,
            marginTop: 24,
            maxWidth: 750,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Gestión de donantes · Donaciones · Inventario de sangre
        </div>

        {/* Badge inferior */}
        <div
          style={{
            position: "absolute",
            bottom: 42,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 40,
            padding: "10px 24px",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22C55E",
              display: "flex",
            }}
          />
          <span style={{ color: "#D1D5DB", fontSize: 18 }}>
            Plataforma segura · Estándares OWASP
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
