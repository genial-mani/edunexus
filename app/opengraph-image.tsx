import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "School Market — Education Recruitment & Institutional Marketplace";
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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#042F2E",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(52, 211, 153, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(52, 211, 153, 0.1) 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Header with Logo Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "18px",
              backgroundColor: "#0F766E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #34D399",
              fontSize: "36px",
              color: "#FCD34D",
            }}
          >
            🎓
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "40px",
                fontWeight: "800",
                letterSpacing: "-1px",
                color: "#FFFFFF",
              }}
            >
              School <span style={{ color: "#34D399" }}>Market</span>
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#A7F3D0",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Institutional Marketplace & Teacher Discovery
            </span>
          </div>
        </div>

        {/* Central Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(52, 211, 153, 0.15)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              color: "#34D399",
              fontSize: "18px",
              fontWeight: "600",
              width: "fit-content",
            }}
          >
            ✦ Connecting Top Educators, Schools & Institutional Transport
          </div>
          <h1
            style={{
              fontSize: "58px",
              fontWeight: "800",
              lineHeight: 1.15,
              margin: 0,
              color: "#FFFFFF",
              maxWidth: "950px",
            }}
          >
            Empowering India&apos;s Education Ecosystem.
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#D1FAE5",
              margin: 0,
              maxWidth: "850px",
              lineHeight: 1.4,
            }}
          >
            Find qualified faculty, explore verified teaching jobs, and source institutional school buses on a single trusted platform.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(52, 211, 153, 0.2)",
            paddingTop: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🏫</span>
              <span style={{ fontSize: "18px", color: "#E6F4EA", fontWeight: "600" }}>
                Verified Schools & Colleges
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>👩‍🏫</span>
              <span style={{ fontSize: "18px", color: "#E6F4EA", fontWeight: "600" }}>
                Talented Teachers Open to Work
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🚌</span>
              <span style={{ fontSize: "18px", color: "#E6F4EA", fontWeight: "600" }}>
                School Bus Fleet Marketplace
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#34D399",
              fontWeight: "700",
              letterSpacing: "0.5px",
            }}
          >
            edunexus.arundigi.in
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
