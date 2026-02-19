import { valueToOklch } from "@/lib/scales";

export function highlightFromValue(
  value: number,
  color: string,
  preferFlats: boolean,
) {
  const pitch = valueToNote(value, {
    prefer: preferFlats ? "flats" : "sharps",
    forceNaturals: true,
  });
  return {
    pitchClass: value % 12,
    label: pitchClassToLabel(pitch),
    color: valueToOklch(value % 12),
  };
}

export const formatMidiNote = (value: number | null, preferFlats: boolean) => {
  if (value === null) {
    return null;
  }
  const pitch = valueToNote(value, {
    prefer: preferFlats ? "flats" : "sharps",
    forceNaturals: true,
  });
  return pitchToLabel(pitch);
};

export function generateNotes(numNotes: number) {
  const series = Array(numNotes)
    .fill(0)
    .map(() => generateNote(noteRange));

  return series;
}
export function generateNote(range: Range) {
  const span = range.to - range.from;
  return Math.floor(Math.random() * span) + range.from;
}

export interface Range {
  from: number;
  to: number;
}

export interface ValueToNoteOptions {
  prefer?: "sharps" | "flats";
  forceNaturals?: boolean;
}
export function valueToNote(
  value: number,
  options?: ValueToNoteOptions,
): Pitch {
  const note: Pitch = {
    letter: "A",
    accidental: "",
    octave: 3,
    value: 57,
  };

  const octaveValue = value % 12;
  const candidates = noteClassByValue[octaveValue];

  if (candidates) {
    const pick = pickPitchClass(candidates, options);
    note.letter = pick.letter;
    note.accidental = pick.accidental;
  }

  const octave = Math.floor(value / 12);
  note.octave = octave - 1;
  note.value = value;

  return note;
}

export const pickPitchClass = (
  candidates: PitchClass[],
  options?: ValueToNoteOptions,
) => {
  const forceNaturals = options?.forceNaturals ?? true;
  const preferredAccidental = options?.prefer ?? "flats";

  const naturalPick = candidates.find((pc) => pc.accidental === "");
  if (naturalPick && forceNaturals) {
    return naturalPick;
  }

  const flatPick = candidates.find(
    (pc) => pc.accidental === "b" || pc.accidental === "bb",
  );
  if (flatPick && preferredAccidental === "flats") {
    return flatPick;
  }

  const sharpPick = candidates.find(
    (pc) => pc.accidental === "#" || pc.accidental === "##",
  );
  if (sharpPick && preferredAccidental === "sharps") {
    return sharpPick;
  }

  return candidates[0];
};

export interface Range {
  from: number;
  to: number;
}
export interface Pitch {
  letter: NoteLetter;
  accidental: Accidental;
  octave: number;
  value: number;
}

export type NoteLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "B";
export type Accidental = "#" | "##" | "b" | "bb" | "";

export const noteRangeGuitar = { from: 52, to: 88 };
export const noteRange = { from: 60, to: 72 };

export interface PitchClass {
  letter: NoteLetter;
  accidental: Accidental;
}

export const noteClassByValue: PitchClass[][] = [
  [
    { letter: "C" as const, accidental: "" as const },
    { letter: "B" as const, accidental: "#" as const },
  ],
  [
    { letter: "C" as const, accidental: "#" as const },
    { letter: "D" as const, accidental: "b" as const },
  ],
  [{ letter: "D" as const, accidental: "" as const }],
  [
    { letter: "D" as const, accidental: "#" as const },
    { letter: "E" as const, accidental: "b" as const },
  ],
  [
    { letter: "E" as const, accidental: "" as const },
    { letter: "F" as const, accidental: "b" as const },
  ],
  [
    { letter: "E" as const, accidental: "#" as const },
    { letter: "F" as const, accidental: "" as const },
  ],
  [
    { letter: "F" as const, accidental: "#" as const },
    { letter: "G" as const, accidental: "b" as const },
  ],
  [{ letter: "G" as const, accidental: "" as const }],
  [
    { letter: "G" as const, accidental: "#" as const },
    { letter: "A" as const, accidental: "b" as const },
  ],
  [{ letter: "A" as const, accidental: "" as const }],
  [
    { letter: "A" as const, accidental: "#" as const },
    { letter: "B" as const, accidental: "b" as const },
  ],
  [
    { letter: "B" as const, accidental: "" as const },
    { letter: "C" as const, accidental: "b" as const },
  ],
];

export const pitchClassToLabel = (pitchClass: PitchClass) =>
  `${pitchClass.letter}${accidentalUnicode[pitchClass.accidental]}`;

export const pitchToLabel = (pitch: Pitch, explicitNatural?: boolean) =>
  `${pitch.letter}${accidentalUnicode[pitch.accidental] || (explicitNatural ? "n" : "")}${pitch.octave}`;

export const pitchToEasyScore = (pitch: Pitch, explicitNatural?: boolean) =>
  `${pitch.letter}${pitch.accidental || (explicitNatural ? "n" : "")}${pitch.octave}`;

export const accidentalUnicode = {
  bb: "♭♭",
  b: "♭",
  "": "",
  "#": "♯",
  "##": "♯♯",
};
