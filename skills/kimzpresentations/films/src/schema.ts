import { z } from "zod";

/**
 * A ProductFilm is a list of scenes. Every scene has its own length (seconds).
 * Colours come from `brand` so films match the deck's theme / brandTheme().
 */
export const Scene = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("hook"),
    seconds: z.number().default(3.5),
    kicker: z.string().optional(),
    line1: z.string(),
    line2: z.string(),
  }),
  z.object({
    kind: z.literal("features"),
    seconds: z.number().default(4.5),
    title: z.string(),
    items: z.array(z.object({ icon: z.string(), title: z.string(), line: z.string().optional() })).max(4),
  }),
  z.object({
    kind: z.literal("screen"),
    seconds: z.number().default(4.5),
    title: z.string(),
    /** file in films/public, e.g. "demo/dashboard.svg" */
    src: z.string(),
    /** zoom target in 0..1 coordinates of the image (Ken Burns push-in) */
    focus: z.object({ x: z.number(), y: z.number(), zoom: z.number() }).default({ x: 0.5, y: 0.5, zoom: 1.35 }),
    callout: z.string().optional(),
  }),
  z.object({
    kind: z.literal("stats"),
    seconds: z.number().default(4),
    title: z.string(),
    items: z.array(z.object({ value: z.number(), suffix: z.string().default(""), label: z.string() })).max(4),
  }),
  z.object({
    kind: z.literal("cta"),
    seconds: z.number().default(3.5),
    line: z.string(),
    sub: z.string().optional(),
  }),
]);

export const FilmSchema = z.object({
  brand: z.object({
    name: z.string(),
    a1: z.string(),
    a2: z.string(),
    a3: z.string(),
    bg: z.string().default("#06050b"),
    ink: z.string().default("#f4f2ff"),
  }),
  rtl: z.boolean().default(false),
  scenes: z.array(Scene).min(1),
});

export type Film = z.infer<typeof FilmSchema>;
export type SceneT = z.infer<typeof Scene>;

export const FPS = 30;
export const TRANSITION = 15; // frames of crossfade/slide between scenes

/** Total frames = sum(scene frames) − overlaps. (Forgetting the subtraction leaves a blank tail.) */
export const filmDuration = (f: Film) =>
  f.scenes.reduce((n, s) => n + Math.round(s.seconds * FPS), 0) - TRANSITION * Math.max(0, f.scenes.length - 1);
