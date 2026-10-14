import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Fragment } from "react";
import { AbsoluteFill } from "remotion";
import { Cta, Features, Hook, Screen, Stats } from "./scenes";
import { FPS, TRANSITION, type Film, type SceneT } from "./schema";

function SceneView({ s, film }: { s: SceneT; film: Film }) {
  const common = { brand: film.brand, rtl: film.rtl };
  switch (s.kind) {
    case "hook":
      return <Hook s={s} {...common} />;
    case "features":
      return <Features s={s} {...common} />;
    case "screen":
      return <Screen s={s} {...common} />;
    case "stats":
      return <Stats s={s} {...common} />;
    case "cta":
      return <Cta s={s} {...common} />;
  }
}

/** Themed multi-scene product film. Alternates fade and slide transitions between scenes. */
export const ProductFilm: React.FC<Film> = (film) => {
  return (
    <AbsoluteFill style={{ backgroundColor: film.brand.bg }}>
      <TransitionSeries>
        {film.scenes.map((s, i) => (
          <Fragment key={i}>
            {i > 0 && <TransitionSeries.Transition presentation={i % 2 ? slide({ direction: film.rtl ? "from-left" : "from-right" }) : fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />}
            <TransitionSeries.Sequence durationInFrames={Math.round(s.seconds * FPS)} name={`${i + 1} · ${s.kind}`}>
              <SceneView s={s} film={film} />
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
