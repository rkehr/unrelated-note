import { Pitch, pitchToLabel } from "@/utils/functions";

interface PitchLabelProps {
  pitch: Pitch;
  explicitNatural?: boolean;
}
export default function PitchLabel(props: PitchLabelProps) {
  const { pitch, explicitNatural } = props;
  return <span>{pitchToLabel(pitch, explicitNatural)}</span>;
}
