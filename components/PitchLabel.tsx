import { Pitch } from "./RandomNotes";

interface PitchLabelProps {
  pitch: Pitch;
  explicitNatural?: boolean;
}
export default function PitchLabel(props: PitchLabelProps) {
  const { pitch, explicitNatural } = props;
  return <span>{pitchToLabel(pitch, explicitNatural)}</span>;
}

export const pitchToLabel = (pitch: Pitch, explicitNatural?: boolean) =>
  `${pitch.letter}${pitch.accidental || (explicitNatural ? "n" : "")}${pitch.octave}`;

export const accidentalUnicode = {
  bb: "♭♭",
  b: "♭",
  "": "",
  "#": "♯",
  "##": "♯♯",
};
