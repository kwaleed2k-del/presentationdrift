import { Composition } from "remotion";
import { arabicFilm, demoFilm } from "./film.config";
import { ProductFilm } from "./ProductFilm";
import { FPS, FilmSchema, filmDuration, type Film } from "./schema";

// Duration is computed from the scenes (sum − transition overlaps), so editing scenes never leaves a blank tail.
const calculateMetadata = ({ props }: { props: Film }) => ({ durationInFrames: filmDuration(props) });

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="ProductFilm" component={ProductFilm} schema={FilmSchema} defaultProps={demoFilm} calculateMetadata={calculateMetadata} durationInFrames={filmDuration(demoFilm)} fps={FPS} width={1920} height={1080} />
      <Composition id="ProductFilmArabic" component={ProductFilm} schema={FilmSchema} defaultProps={arabicFilm} calculateMetadata={calculateMetadata} durationInFrames={filmDuration(arabicFilm)} fps={FPS} width={1920} height={1080} />
    </>
  );
};
