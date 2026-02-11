import { Pitch } from "./RandomNotes";

interface PitchLabelProps {
  pitch: Pitch;
}
export default function PitchLabel(props: PitchLabelProps) {
  const { pitch } = props;
  return <span>{pitchToLabel(pitch)}</span>;
}

export const pitchToLabel = (pitch: Pitch) =>
  `${pitch.letter}${pitch.accidental}${pitch.octave}`;
