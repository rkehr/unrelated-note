import {
  NoteLetter,
  Pitch,
  pitchClassToLabel,
  valueToNote,
} from "@/utils/functions";
import MusicStaff from "./MusicStaff";

interface MidiNoteStaveProps {
  notes: Pitch[];
  preferFlats: boolean;
  correctlyPlayedIndex: number;
}

export default function MidiNoteStave(props: MidiNoteStaveProps) {
  const { notes, correctlyPlayedIndex } = props;
  const pitches = notes;

  const bars = groupBars(pitches).map(pitchesToEasyScore);
  const joinedBars = joinGroups(bars);
  const labels = pitches.map((pitch) => pitchClassToLabel(pitch));

  return (
    <MusicStaff
      notes={joinedBars}
      labels={labels}
      correctlyPlayedIndex={correctlyPlayedIndex}
    />
  );
}

function groupBars<T>(array: T[], num: number = 4): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < array.length; i += num) {
    groups.push(array.slice(i, i + num));
  }
  return groups;
}

function joinGroups(groups: string[][], separator: string = ", ") {
  return groups.map((group) => group.join(separator));
}

function pitchesToEasyScore(pitches: Pitch[]) {
  const noteAccidentals: Partial<Record<NoteLetter, number>> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
  };
  return pitches
    .map((pitch) => {
      const { letter, accidental, octave } = pitch;

      const needsAccidental = noteAccidentals[letter] !== accidental;

      noteAccidentals[letter] = accidental;

      let accidentalStr = "";
      if (needsAccidental) {
        if (accidental > 0) {
          accidentalStr = "#".repeat(accidental);
        } else if (accidental < 0) {
          accidentalStr = "b".repeat(Math.abs(accidental));
        } else {
          accidentalStr = "n";
        }
      }

      return `${letter}${accidentalStr}${octave}`;
    })
    .map((label) => label + "/q");
}
