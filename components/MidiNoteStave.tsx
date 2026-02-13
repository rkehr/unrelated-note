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
  const pitchLabels = pitches
    .map((pitch) => {
      if (pitch.accidental !== "") {
        noteHasAccidental[pitch.letter] = true;
      }
      if (noteHasAccidental[pitch.letter] && pitch.accidental === "") {
        noteHasAccidental[pitch.letter] = false;
        return pitchToLabel(pitch, true);
      }
      return pitchToLabel(pitch);
    })
    .map((label) => label + "/q");

  const barredPitches = addBarLines(pitchLabels);

  const staffPitches = barredPitches.join(", ");
  return <MusicStaff notes={staffPitches} />;
}

function addBarLines(notes: string[], notesPerBar: number = 4) {
  const result: string[] = [];

  for (let i = 0; i < notes.length; i++) {
    result.push(notes[i]);
    if ((i + 1) % notesPerBar === 0 && i !== notes.length - 1) {
      result.push("|");
    }
  }

  return result;
}
