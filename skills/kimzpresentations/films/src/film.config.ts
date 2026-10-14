import type { Film } from "./schema";

/**
 * Edit this (or the props panel in Remotion Studio) to make a film.
 * Use the same hex colours as the deck so the film sits naturally on a VideoWallSlide.
 * Fictional demo content — replace with the real product.
 */
export const demoFilm: Film = {
  brand: { name: "Orbit Labs", a1: "#34d399", a2: "#60a5fa", a3: "#f472b6", bg: "#030712", ink: "#f8fafc" },
  rtl: false,
  scenes: [
    { kind: "hook", seconds: 3.5, kicker: "meet orbit", line1: "Your calendar,", line2: "on autopilot." },
    {
      kind: "features",
      seconds: 4.5,
      title: "It defends your week.",
      items: [
        { icon: "🛡️", title: "Focus blocks", line: "Protected automatically" },
        { icon: "🤝", title: "Negotiates", line: "with other calendars" },
        { icon: "📈", title: "Reports", line: "hours won back" },
      ],
    },
    { kind: "screen", seconds: 4.5, title: "One dashboard. Zero busywork.", src: "demo/dashboard.svg", focus: { x: 0.85, y: 0.8, zoom: 1.5 }, callout: "Auto-schedule ✦" },
    {
      kind: "stats",
      seconds: 4,
      title: "Demo numbers, real feeling.",
      items: [
        { value: 1284, suffix: "", label: "meetings saved" },
        { value: 312, suffix: "h", label: "hours back" },
        { value: 97, suffix: "%", label: "on-time rate" },
      ],
    },
    { kind: "cta", seconds: 3.5, line: "Give your team its week back.", sub: "orbit.example · demo" },
  ],
};

export const arabicFilm: Film = {
  brand: { name: "ريادة", a1: "#fb923c", a2: "#f43f5e", a3: "#facc15", bg: "#120507", ink: "#fff5ef" },
  rtl: true,
  scenes: [
    { kind: "hook", seconds: 3.5, line1: "فكرتك تستاهل", line2: "حملة كاملة" },
    { kind: "features", seconds: 4.5, title: "كل شيء في مكان واحد", items: [{ icon: "✍️", title: "اكتب فكرتك" }, { icon: "🎨", title: "تصاميم جاهزة" }, { icon: "🚀", title: "انشر بضغطة" }] },
    { kind: "cta", seconds: 3.5, line: "جرّب ريادة اليوم", sub: "عرض تجريبي" },
  ],
};
