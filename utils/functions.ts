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
    value: toPitchClass(pitch),
    label: pitchClassToLabel(pitch),
    color: valueToOklch(value),
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

export interface PitchClass {
  letter: NoteLetter;
  accidental: Accidental;
  value: number;
}

export function toPitchClass(pitch: Pitch): PitchClass {
  const { letter, accidental, value } = pitch;
  return {
    letter,
    accidental,
    value: value % 12,
  };
}
export function toPitch(pitchClass: PitchClass, octave: number): Pitch {
  const { letter, accidental, value } = pitchClass;
  return {
    letter,
    accidental,
    octave,
    value: value + octave * 12,
  };
}

export function compare(
  a: Pitch | PitchClass | number,
  b: Pitch | PitchClass | number,
) {
  const valA = typeof a === "number" ? a : a.value;
  const valB = typeof b === "number" ? b : b.value;
  if (
    (isPitch(a) || typeof a === "number") &&
    (isPitch(b) || typeof b === "number")
  ) {
    return valA === valB;
  }
  return valA % 12 === valB % 12;
}
function isPitch(obj: Pitch | PitchClass | number): obj is Pitch {
  if (typeof obj === "number") {
    return false;
  }
  if (Object.hasOwn(obj, "octave")) {
    return true;
  }
  return false;
}

export type NoteLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "B";
export type Accidental = "#" | "##" | "b" | "bb" | "";

export const noteRangeGuitar = { from: 52, to: 88 };
export const noteRange = { from: 60, to: 72 };

export const noteClassByValue: PitchClass[][] = [
  [
    { letter: "C" as const, accidental: "" as const, value: 0 },
    { letter: "B" as const, accidental: "#" as const, value: 0 },
  ],
  [
    { letter: "C" as const, accidental: "#" as const, value: 1 },
    { letter: "D" as const, accidental: "b" as const, value: 1 },
  ],
  [{ letter: "D" as const, accidental: "" as const, value: 2 }],
  [
    { letter: "D" as const, accidental: "#" as const, value: 3 },
    { letter: "E" as const, accidental: "b" as const, value: 3 },
  ],
  [
    { letter: "E" as const, accidental: "" as const, value: 4 },
    { letter: "F" as const, accidental: "b" as const, value: 4 },
  ],
  [
    { letter: "E" as const, accidental: "#" as const, value: 5 },
    { letter: "F" as const, accidental: "" as const, value: 5 },
  ],
  [
    { letter: "F" as const, accidental: "#" as const, value: 6 },
    { letter: "G" as const, accidental: "b" as const, value: 6 },
  ],
  [{ letter: "G" as const, accidental: "" as const, value: 7 }],
  [
    { letter: "G" as const, accidental: "#" as const, value: 8 },
    { letter: "A" as const, accidental: "b" as const, value: 8 },
  ],
  [{ letter: "A" as const, accidental: "" as const, value: 9 }],
  [
    { letter: "A" as const, accidental: "#" as const, value: 10 },
    { letter: "B" as const, accidental: "b" as const, value: 10 },
  ],
  [
    { letter: "B" as const, accidental: "" as const, value: 11 },
    { letter: "C" as const, accidental: "b" as const, value: 11 },
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
