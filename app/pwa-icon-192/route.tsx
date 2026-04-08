import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "192px",
          height: "192px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#ffffff",
          fontSize: 84,
          fontWeight: 900,
          borderRadius: 44,
          letterSpacing: -6,
        }}
      >
        AA
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}