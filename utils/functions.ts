import { valueToOklch } from "@/lib/scales";

export function highlightFromValue(value: number, preferFlats: boolean) {
  const pitch = valueToNote(value, {
    preferFlats,
    forceNaturals: true,
  });
  return highlightFromPitchClass(pitch);
}
export function highlightFromPitchClass(pitchClass: PitchClass | Pitch) {
  return {
    value: Object.hasOwn(pitchClass, "octave")
      ? toPitchClass(pitchClass as Pitch)
      : pitchClass,
    label: pitchClassToLabel(pitchClass),
    color: valueToOklch(pitchClass.value),
  };
}

export const formatMidiNote = (value: number | null, preferFlats: boolean) => {
  if (value === null) {
    return null;
  }
  const pitch = valueToNote(value, {
    preferFlats,
    forceNaturals: true,
  });
  return pitchToLabel(pitch);
};

export interface ValueToNoteOptions {
  preferFlats?: boolean;
  forceNaturals?: boolean;
}
export function valueToNote(
  value: number,
  options?: ValueToNoteOptions,
): Pitch {
  const note: Pitch = {
    letter: "A",
    accidental: 0,
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
  const { forceNaturals = true, preferFlats = true } = options ?? {};

  const naturalPick = candidates.find((pc) => pc.accidental === 0);
  if (naturalPick && forceNaturals) {
    return naturalPick;
  }

  const flatPick = candidates.find(
    (pc) => pc.accidental === -1 || pc.accidental === -2,
  );
  if (flatPick && preferFlats) {
    return flatPick;
  }

  const sharpPick = candidates.find(
    (pc) => pc.accidental === 1 || pc.accidental === 2,
  );
  if (sharpPick && !preferFlats) {
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

export type NoteLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type Accidental = -2 | -1 | 0 | 1 | 2;

export const noteClassByValue: PitchClass[][] = [
  [
    { letter: "C" as const, accidental: 0 as const, value: 0 },
    { letter: "B" as const, accidental: 1 as const, value: 0 },
  ],
  [
    { letter: "C" as const, accidental: 1 as const, value: 1 },
    { letter: "D" as const, accidental: -1 as const, value: 1 },
  ],
  [{ letter: "D" as const, accidental: 0 as const, value: 2 }],
  [
    { letter: "D" as const, accidental: 1 as const, value: 3 },
    { letter: "E" as const, accidental: -1 as const, value: 3 },
  ],
  [
    { letter: "E" as const, accidental: 0 as const, value: 4 },
    { letter: "F" as const, accidental: -1 as const, value: 4 },
  ],
  [
    { letter: "E" as const, accidental: 1 as const, value: 5 },
    { letter: "F" as const, accidental: 0 as const, value: 5 },
  ],
  [
    { letter: "F" as const, accidental: 1 as const, value: 6 },
    { letter: "G" as const, accidental: -1 as const, value: 6 },
  ],
  [{ letter: "G" as const, accidental: 0 as const, value: 7 }],
  [
    { letter: "G" as const, accidental: 1 as const, value: 8 },
    { letter: "A" as const, accidental: -1 as const, value: 8 },
  ],
  [{ letter: "A" as const, accidental: 0 as const, value: 9 }],
  [
    { letter: "A" as const, accidental: 1 as const, value: 10 },
    { letter: "B" as const, accidental: -1 as const, value: 10 },
  ],
  [
    { letter: "B" as const, accidental: 0 as const, value: 11 },
    { letter: "C" as const, accidental: -1 as const, value: 11 },
  ],
];

export const pitchClassToLabel = (pitchClass: PitchClass) =>
  `${pitchClass.letter}${accidentalUnicode[pitchClass.accidental]}`;

export const pitchToLabel = (pitch: Pitch) =>
  `${pitch.letter}${accidentalUnicode[pitch.accidental]}${pitch.octave}`;

export const pitchToEasyScore = (pitch: Pitch, explicitNatural?: boolean) =>
  `${pitch.letter}${accidentalEasyScore[pitch.accidental] || (explicitNatural ? "n" : "")}${pitch.octave}`;

export const accidentalEasyScore = {
  [-2]: "bb",
  [-1]: "b",
  0: "",
  1: "#",
  2: "##",
};
export const accidentalUnicode = {
  [-2]: "♭♭",
  [-1]: "♭",
  0: "",
  1: "♯",
  2: "♯♯",
};
