import { Accidental, NoteLetter, Pitch, PitchClass } from "@/utils/functions";
import { argv0 } from "process";
import { Note } from "vexflow";

export interface Scale {
  name: string;
  degrees: ScaleDegree[];
  modes: string[];
}

export interface ScaleDegree {
  name: string;
  letterDelta: number;
  valueDelta: number;
}

export const SCALE_DEGREES: Record<string, ScaleDegree> = {
  PRIMA: {
    name: "prima",
    letterDelta: 0,
    valueDelta: 0,
  },
  MINOR_SECOND: {
    name: "minor second",
    letterDelta: 1,
    valueDelta: 1,
  },
  MAJOR_SECOND: {
    name: "major second",
    letterDelta: 1,
    valueDelta: 2,
  },
  MINOR_THIRD: {
    name: "minor third",
    letterDelta: 2,
    valueDelta: 3,
  },
  MAJOR_THIRD: {
    name: "major third",
    letterDelta: 2,
    valueDelta: 4,
  },
  PERFECT_FOURTH: {
    name: "perfect fourth",
    letterDelta: 3,
    valueDelta: 5,
  },
  AUGMENTED_FOURTH: {
    name: "augmented fourth",
    letterDelta: 3,
    valueDelta: 6,
  },
  DIMINISHED_FIFTH: {
    name: "diminished fifth",
    letterDelta: 4,
    valueDelta: 6,
  },
  PERFECT_FIFTH: {
    name: "perfect fifth",
    letterDelta: 4,
    valueDelta: 7,
  },
  MINOR_SIXTH: {
    name: "minor sixth",
    letterDelta: 5,
    valueDelta: 8,
  },
  MAJOR_SIXTH: {
    name: "major sixth",
    letterDelta: 5,
    valueDelta: 9,
  },
  MINOR_SEVENTH: {
    name: "minor seventh",
    letterDelta: 6,
    valueDelta: 10,
  },
  MAJOR_SEVENTH: {
    name: "major seventh",
    letterDelta: 6,
    valueDelta: 11,
  },
  OCTAVE: {
    name: "octave",
    letterDelta: 7,
    valueDelta: 12,
  },
};

export const SCALES: Record<string, Scale> = {
  MAJOR: {
    name: "major",
    degrees: [
      SCALE_DEGREES.PRIMA,
      SCALE_DEGREES.MAJOR_SECOND,
      SCALE_DEGREES.MAJOR_THIRD,
      SCALE_DEGREES.PERFECT_FOURTH,
      SCALE_DEGREES.PERFECT_FIFTH,
      SCALE_DEGREES.MAJOR_SIXTH,
      SCALE_DEGREES.MAJOR_SEVENTH,
    ],
    modes: [
      "ionian",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "aeolian",
      "locrian",
    ],
  },
  MINOR: {
    name: "minor",
    degrees: [
      SCALE_DEGREES.PRIMA,
      SCALE_DEGREES.MAJOR_SECOND,
      SCALE_DEGREES.MINOR_THIRD,
      SCALE_DEGREES.PERFECT_FOURTH,
      SCALE_DEGREES.PERFECT_FIFTH,
      SCALE_DEGREES.MINOR_SIXTH,
      SCALE_DEGREES.MINOR_SEVENTH,
    ],
    modes: [],
  },
  HARMONIC_MINOR: {
    name: "harmonic minor",
    degrees: [
      SCALE_DEGREES.PRIMA,
      SCALE_DEGREES.MAJOR_SECOND,
      SCALE_DEGREES.MINOR_THIRD,
      SCALE_DEGREES.PERFECT_FOURTH,
      SCALE_DEGREES.PERFECT_FIFTH,
      SCALE_DEGREES.MINOR_SIXTH,
      SCALE_DEGREES.MAJOR_SEVENTH,
    ],
    modes: [],
  },
  MELODIC_MINOR: {
    name: "melodic minor",
    degrees: [
      SCALE_DEGREES.PRIMA,
      SCALE_DEGREES.MAJOR_SECOND,
      SCALE_DEGREES.MINOR_THIRD,
      SCALE_DEGREES.PERFECT_FOURTH,
      SCALE_DEGREES.PERFECT_FIFTH,
      SCALE_DEGREES.MAJOR_SIXTH,
      SCALE_DEGREES.MAJOR_SEVENTH,
    ],
    modes: [],
  },
  MAJOR_PENTATONIC: {
    name: "major pentatonic",
    degrees: [
      SCALE_DEGREES.PRIMA,
      SCALE_DEGREES.MAJOR_SECOND,
      SCALE_DEGREES.MAJOR_THIRD,
      SCALE_DEGREES.PERFECT_FIFTH,
      SCALE_DEGREES.MAJOR_SIXTH,
    ],
    modes: [],
  },
  MINOR_PENTATONIC: {
    name: "minor pentatonic",
    degrees: [
      SCALE_DEGREES.PRIMA,
      SCALE_DEGREES.MINOR_THIRD,
      SCALE_DEGREES.PERFECT_FOURTH,
      SCALE_DEGREES.PERFECT_FIFTH,
      SCALE_DEGREES.MINOR_SEVENTH,
    ],
    modes: [],
  },
};

export function applyScale(pitchClass: PitchClass, scale: Scale): PitchClass[] {
  const rootValue = pitchClassValue(pitchClass);
  const pitches = scale.degrees.map((scaleDegree): PitchClass => {
    const value = rootValue + scaleDegree.valueDelta;
    const letter = applyLetterDelta(pitchClass.letter, scaleDegree.letterDelta);
    const letterValue = letterValues[letter];
    let letterDiff = (value - letterValue) % 12;
    const altLetterDiff = (letterDiff - 12) % 12;
    if (Math.abs(altLetterDiff) < Math.abs(letterDiff)) {
      letterDiff = altLetterDiff;
    }
    const accidental = accidentalByOffset(letterDiff) as Accidental;
    return { letter, accidental, value };
  });
  return pitches;
}

export function pitchClassValue(pitchClass: PitchClass) {
  let val = 0;
  val += letterValues[pitchClass.letter];
  val += offsetByAccidental(pitchClass.accidental);
  return val % 12;
}

function offsetByAccidental(accidental: string) {
  let result = 0;
  for (let i = 0; i < accidental.length; i++) {
    const char = accidental[i];
    if (char === "#") {
      result += 1;
    }
    if (char === "b") {
      result -= 1;
    }
  }
  return result;
}
function accidentalByOffset(offset: number) {
  if (offset === 0) {
    return "";
  }
  let accidental = "";
  const absolute = Math.abs(offset);
  if (offset < 0) {
    accidental = "b";
  }
  if (offset > 0) {
    accidental = "#";
  }
  const result = Array(absolute).fill(accidental).join();
  return result;
}

const letterValues: Record<NoteLetter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const LETTERS: NoteLetter[] = ["C", "D", "E", "F", "G", "A", "B"];

function applyLetterDelta(letter: NoteLetter, delta: number) {
  const letterIndex = LETTERS.findIndex(
    (currentLetter) => currentLetter === letter,
  );
  return LETTERS[(letterIndex + delta) % LETTERS.length];
}

export function valueToOklch(n: number): string {
  const hue = ((n % 12) / 12) * 360;
  return `oklch(0.5 0.25 ${hue})`;
}
