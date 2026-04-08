import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#ffffff",
          fontSize: 220,
          fontWeight: 900,
          borderRadius: 120,
          letterSpacing: -12,
        }}
      >
        AA
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}