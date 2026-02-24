import { Pitch, pitchToLabel } from "@/utils/functions";

interface PitchLabelProps {
  pitch: Pitch;
}
export default function PitchLabel(props: PitchLabelProps) {
  const { pitch } = props;
  return <span>{pitchToLabel(pitch)}</span>;
}
