import FilmPreview from "@/components/acquisition-film/FilmPreview";

// Isolated clock-driven preview of the acquisition film edit (source for
// the later rendered production video). Not linked from any nav; `/` and
// /concept/acquisition-scroll are untouched.
export default function AcquisitionFilmRender() {
  return <FilmPreview />;
}
