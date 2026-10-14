import { loadFont } from "@remotion/google-fonts/SpaceGrotesk";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Film, SceneT } from "./schema";

const { fontFamily } = loadFont("normal", { weights: ["500", "700"], subsets: ["latin"] });
const ARABIC = '"IBM Plex Sans Arabic", "Noto Sans Arabic", sans-serif';

type Brand = Film["brand"];
type P<K extends SceneT["kind"]> = { s: Extract<SceneT, { kind: K }>; brand: Brand; rtl: boolean };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

/** Shared background: brand gradient + two drifting glows + a faint grid. */
const Backplate: React.FC<{ brand: Brand }> = ({ brand }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 70% 0%, ${brand.a2}33, ${brand.bg} 65%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 75%)",
        }}
      />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: 999, background: brand.a1, opacity: 0.22, filter: "blur(140px)", left: -260, top: -260, translate: `${Math.sin(frame / 40) * 60}px ${Math.cos(frame / 50) * 40}px` }} />
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: 999, background: brand.a2, opacity: 0.2, filter: "blur(140px)", right: -200, bottom: -300, translate: `${Math.cos(frame / 45) * 60}px ${Math.sin(frame / 35) * 40}px` }} />
    </AbsoluteFill>
  );
};

const rise = (frame: number, delay: number, fps: number) => ({
  opacity: interpolate(frame, [delay, delay + 0.5 * fps], [0, 1], clamp),
  translate: `0px ${interpolate(frame, [delay, delay + 0.7 * fps], [40, 0], { ...clamp, easing: out })}px`,
});

export const Hook: React.FC<P<"hook">> = ({ s, brand, rtl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = s.line1.split(" ");
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: rtl ? ARABIC : fontFamily, color: brand.ink, direction: rtl ? "rtl" : "ltr" }}>
      <Backplate brand={brand} />
      {s.kicker && <div style={{ ...rise(frame, 0, fps), fontSize: 26, letterSpacing: "0.4em", textTransform: "uppercase", color: brand.a1, marginBottom: 30 }}>{s.kicker}</div>}
      <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-0.04em", display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center", maxWidth: 1600 }}>
        {words.map((w, i) => (
          <span key={i} style={rise(frame, 0.2 * fps + i * 4, fps)}>
            {w}
          </span>
        ))}
      </div>
      <div
        style={{
          ...rise(frame, 0.9 * fps, fps),
          marginTop: 20,
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          backgroundImage: `linear-gradient(100deg, ${brand.a1}, ${brand.a2}, ${brand.a3})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {s.line2}
      </div>
    </AbsoluteFill>
  );
};

export const Features: React.FC<P<"features">> = ({ s, brand, rtl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = [brand.a1, brand.a2, brand.a3, brand.a1];
  return (
    <AbsoluteFill style={{ padding: "120px 140px", fontFamily: rtl ? ARABIC : fontFamily, color: brand.ink, direction: rtl ? "rtl" : "ltr", gap: 70 }}>
      <Backplate brand={brand} />
      <div style={{ ...rise(frame, 0, fps), fontSize: 84, fontWeight: 700, letterSpacing: "-0.03em", position: "relative" }}>{s.title}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.items.length}, 1fr)`, gap: 32, position: "relative" }}>
        {s.items.map((it, i) => {
          const pop = spring({ frame: frame - (0.4 * fps + i * 6), fps, config: { damping: 14, stiffness: 140 } });
          return (
            <div
              key={it.title}
              style={{
                scale: interpolate(pop, [0, 1], [0.7, 1]),
                opacity: interpolate(pop, [0, 1], [0, 1]),
                borderRadius: 32,
                padding: 40,
                background: "rgba(255,255,255,.05)",
                border: `1px solid ${colors[i]}55`,
                boxShadow: `0 0 70px -24px ${colors[i]}`,
                display: "flex",
                flexDirection: "column",
                gap: 18,
                minHeight: 380,
              }}
            >
              <div style={{ fontSize: 90 }}>{it.icon}</div>
              <div style={{ fontSize: 46, fontWeight: 700 }}>{it.title}</div>
              {it.line && <div style={{ fontSize: 28, opacity: 0.65 }}>{it.line}</div>}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Screen: React.FC<P<"screen">> = ({ s, brand, rtl }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0.6 * fps, durationInFrames], [1, s.focus.zoom], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", fontFamily: rtl ? ARABIC : fontFamily, color: brand.ink, direction: rtl ? "rtl" : "ltr", paddingTop: 90 }}>
      <Backplate brand={brand} />
      <div style={{ ...rise(frame, 0, fps), fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em", position: "relative", marginBottom: 50 }}>{s.title}</div>
      <div
        style={{
          position: "relative",
          width: 1400,
          height: 700,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: `0 0 0 2px ${brand.a1}88, 0 60px 160px -40px ${brand.a1}`,
          translate: `0px ${interpolate(enter, [0, 1], [120, 0])}px`,
          opacity: enter,
        }}
      >
        <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(zoom), transformOrigin: `${s.focus.x * 100}% ${s.focus.y * 100}%` }} />
      </div>
      {s.callout && (
        <div
          style={{
            position: "absolute",
            bottom: 90,
            right: 200,
            padding: "18px 28px",
            borderRadius: 20,
            fontSize: 30,
            fontWeight: 700,
            background: "rgba(10,9,16,.92)",
            border: `1px solid ${brand.a1}66`,
            boxShadow: `0 20px 60px -20px ${brand.a1}`,
            scale: String(spring({ frame: frame - 1.4 * fps, fps, config: { damping: 12 } })),
          }}
        >
          {s.callout}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Stats: React.FC<P<"stats">> = ({ s, brand, rtl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = [brand.a1, brand.a2, brand.a3, brand.a1];
  return (
    <AbsoluteFill style={{ padding: "140px", fontFamily: rtl ? ARABIC : fontFamily, color: brand.ink, direction: rtl ? "rtl" : "ltr", gap: 80 }}>
      <Backplate brand={brand} />
      <div style={{ ...rise(frame, 0, fps), fontSize: 84, fontWeight: 700, letterSpacing: "-0.03em", position: "relative" }}>{s.title}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.items.length}, 1fr)`, gap: 40, position: "relative" }}>
        {s.items.map((it, i) => {
          const p = interpolate(frame, [0.4 * fps + i * 5, 1.8 * fps + i * 5], [0, 1], { ...clamp, easing: out });
          return (
            <div key={it.label} style={{ opacity: Math.min(1, p * 2) }}>
              <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: "-0.04em", color: colors[i], lineHeight: 1 }}>
                {Math.round(it.value * p).toLocaleString("en-US")}
                {it.suffix}
              </div>
              <div style={{ fontSize: 34, opacity: 0.7, marginTop: 16 }}>{it.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Cta: React.FC<P<"cta">> = ({ s, brand, rtl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: rtl ? ARABIC : fontFamily, color: brand.ink, direction: rtl ? "rtl" : "ltr", gap: 40 }}>
      <Backplate brand={brand} />
      <div style={{ position: "relative", fontSize: 40, letterSpacing: "0.35em", textTransform: "uppercase", color: brand.a1, opacity: interpolate(frame, [0, 10], [0, 1], clamp) }}>{brand.name}</div>
      <div style={{ position: "relative", fontSize: 130, fontWeight: 700, letterSpacing: "-0.04em", scale: String(interpolate(pop, [0, 1], [0.85, 1])), opacity: pop, textAlign: "center", maxWidth: 1600 }}>{s.line}</div>
      {s.sub && (
        <div
          style={{
            position: "relative",
            padding: "20px 44px",
            borderRadius: 999,
            fontSize: 36,
            fontWeight: 700,
            color: brand.bg,
            background: `linear-gradient(90deg, ${brand.a1}, ${brand.a2})`,
            ...rise(frame, 0.7 * fps, fps),
          }}
        >
          {s.sub}
        </div>
      )}
    </AbsoluteFill>
  );
};
