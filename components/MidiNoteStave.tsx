import {
  NoteLetter,
  pitchClassToLabel,
  pitchToEasyScore,
  valueToNote,
} from "@/utils/functions";
import MusicStaff from "./MusicStaff";

interface MidiNoteStaveProps {
  notes: number[];
  preferFlats: boolean;
  correctlyPlayedIndex: number;
}
export default function MidiNoteStave(props: MidiNoteStaveProps) {
  const { notes, preferFlats, correctlyPlayedIndex } = props;
  const pitches = notes.map((pitch) =>
    valueToNote(pitch, {
      prefer: preferFlats ? "flats" : "sharps",
      forceNaturals: true,
    }),
  );
  const noteHasAccidental: Partial<Record<NoteLetter, boolean>> = {};
  const easyScore = pitches
    .map((pitch) => {
      if (pitch.accidental !== "") {
        noteHasAccidental[pitch.letter] = true;
      }
      if (noteHasAccidental[pitch.letter] && pitch.accidental === "") {
        noteHasAccidental[pitch.letter] = false;
        return pitchToEasyScore(pitch, true);
      }
      return pitchToEasyScore(pitch);
    })
    .map((label) => label + "/q");

  const barredPitches = addBarLines(easyScore);
  const labels = pitches.map((pitch, index) => pitchClassToLabel(pitch));

  const staffPitches = barredPitches.join(", ");
  return (
    <MusicStaff
      notes={staffPitches}
      labels={labels}
      correctlyPlayedIndex={correctlyPlayedIndex}
    />
  );
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
