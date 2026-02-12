import { accidentalUnicode } from "./PitchLabel";
import { PitchClass } from "./RandomNotes";

interface PitchClassLabelProps {
  pitchClass: PitchClass;
}
export default function PitchClassLabel(props: PitchClassLabelProps) {
  const { pitchClass } = props;
  return <span>{pitchClassToLabel(pitchClass)}</span>;
}

export const pitchClassToLabel = (pitchClass: PitchClass) =>
  `${pitchClass.letter}${accidentalUnicode[pitchClass.accidental]}`;
