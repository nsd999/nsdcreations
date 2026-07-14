import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "NSD Creations Logo";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#030303",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: "absolute",
            width: "30px",
            height: "30px",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
            top: "5px",
            left: "5px",
          }}
        />
        {/* Stylized N Symbol */}
        <span
          style={{
            fontSize: "20px",
            fontWeight: 900,
            background: "linear-gradient(135deg, #FF8A00 0%, #FFA726 30%, #8b5cf6 100%)",
            backgroundClip: "text",
            color: "transparent",
            fontFamily: "sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          N
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
