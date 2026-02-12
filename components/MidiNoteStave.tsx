import MusicStaff from "./MusicStaff";
import { pitchToLabel } from "./PitchLabel";
import { NoteLetter, valueToNote } from "./RandomNotes";

interface MidiNoteStaveProps {
  notes: number[];
  preferFlats: boolean;
}
export default function MidiNoteStave(props: MidiNoteStaveProps) {
  const { notes, preferFlats } = props;
  const pitches = notes.map((pitch) =>
    valueToNote(pitch, {
      prefer: preferFlats ? "flats" : "sharps",
      forceNaturals: true,
    }),
  );
  const noteHasAccidental: Partial<Record<NoteLetter, boolean>> = {};
  const pitchLabels = pitches.map((pitch) => {
    if (pitch.accidental !== "") {
      noteHasAccidental[pitch.letter] = true;
    }
    if (noteHasAccidental[pitch.letter] && pitch.accidental === "") {
      noteHasAccidental[pitch.letter] = false;
      return pitchToLabel(pitch, true);
    }
    return pitchToLabel(pitch);
  });
  pitchLabels[0] = pitchLabels[0] + "/q";
  const staffPitches = pitchLabels.join(", ");
  return <MusicStaff notes={staffPitches} width={450} height={300} />;
}
