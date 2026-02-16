import { PitchClass, pitchClassToLabel } from "@/utils/functions";

interface PitchClassLabelProps {
  pitchClass: PitchClass;
}
export default function PitchClassLabel(props: PitchClassLabelProps) {
  const { pitchClass } = props;
  return <span>{pitchClassToLabel(pitchClass)}</span>;
}
