"use client";

import { useEffect, useState } from "react";
import { pitchToLabel } from "./PitchLabel";
import MusicStaff from "./MusicStaff";
import { Button } from "./ui/button";
import { pitchClassToLabel } from "./PitchClassLabel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import FretBoard from "./FretBoard";
import { HighlightedFret } from "./FretBoardString";

export default function RandomNotes() {
  const [numNotes, setNumNotes] = useState(4);
  const [currentNotes, setCurrentNotes] = useState<number[]>([69, 69, 69, 69]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentNotes(generateNotes(numNotes));
  }, []);

  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(
    null,
  );
  const [tempNoteIndex, setTempNoteIndex] = useState<number | null>(null);

  const [preferFlats, setPreferFlats] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<number>(0);
  const hideStave = viewModes[viewMode] === "names";
  const hideNames = viewModes[viewMode] === "stave";

  const handleGenerateNewNotes = () => {
    setCurrentNotes(generateNotes(numNotes));
    setSelectedNoteIndex(null);
  };
  const pitches = currentNotes.map((pitch) =>
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

  const pitchClassLabels = pitches.map(pitchClassToLabel);

  const highlights: HighlightedFret[] = [];

  const selectedColor = "#77AACC";
  const tempColor = "#AA77CC";

  if (
    tempNoteIndex !== null &&
    typeof currentNotes[tempNoteIndex] !== "undefined"
  ) {
    highlights.push(
      highlightFromValue(currentNotes[tempNoteIndex], tempColor, preferFlats),
    );
  }

  if (
    selectedNoteIndex !== null &&
    typeof currentNotes[selectedNoteIndex] !== "undefined"
  ) {
    highlights.push(
      highlightFromValue(
        currentNotes[selectedNoteIndex],
        selectedColor,
        preferFlats,
      ),
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full justify-between">
      <div
        className={`bg-white transition-opacity ${hideStave ? "opacity-0" : ""}`}
      >
        <MusicStaff notes={staffPitches} width={450} height={300} />
      </div>

      <div
        className={`text-5xl font-bold mt-[-5rem] flex align-center gap-8 shrink-0 transition-opacity ${hideNames ? "opacity-0" : ""}`}
      >
        {pitchClassLabels.map((pitchClassLabel, index) => {
          const isSelected = selectedNoteIndex === index;
          const isTemp = tempNoteIndex === index;
          const color = isTemp
            ? tempColor
            : isSelected
              ? selectedColor
              : undefined;
          return (
            <div
              key={index}
              className={`rounded-full w-12 text-center `}
              style={{
                background: color,
              }}
              onMouseEnter={() => {
                setTempNoteIndex(index);
              }}
              onMouseLeave={() => {
                setTempNoteIndex(null);
              }}
              onClick={() => {
                setSelectedNoteIndex(
                  selectedNoteIndex !== index ? index : null,
                );
              }}
            >
              {pitchClassLabel}
            </div>
          );
        })}
      </div>

      <FretBoard highlighted={highlights} />

      <Button className="w-full" onClick={handleGenerateNewNotes}>
        generate!
      </Button>

      <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            options
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex justify-between gap-4 w-full p-4">
            <Button
              className=""
              onClick={() => setViewMode((viewMode + 1) % viewModes.length)}
            >
              view: {viewModes[viewMode]}
            </Button>
            <Button className="" onClick={() => setPreferFlats(!preferFlats)}>
              prefer: {preferFlats ? "b" : "#"}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const viewModes = ["both", "names", "stave"];

function highlightFromValue(
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
    color: color,
  };
}

function generateNotes(numNotes: number) {
  const series = Array(numNotes)
    .fill(0)
    .map(() => generateNote(noteRange));

  return series;
}
function generateNote(range: Range) {
  const span = range.to - range.from;
  return Math.floor(Math.random() * span) + range.from;
}

interface Range {
  from: number;
  to: number;
}

interface ValueToNoteOptions {
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

const pickPitchClass = (
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

interface Range {
  from: number;
  to: number;
}
export interface Pitch {
  letter: NoteLetter;
  accidental: Accidental;
  octave: number;
  value: number;
}

type NoteLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "B";
type Accidental = "#" | "##" | "b" | "bb" | "";

const offsetByAccidental: Record<Accidental, number> = {
  "##": 2,
  "#": 1,
  "": 0,
  b: -1,
  bb: -2,
};

const noteRangeGuitar = { from: 52, to: 88 };
const noteRange = { from: 60, to: 72 };

export interface PitchClass {
  letter: NoteLetter;
  accidental: Accidental;
}

const noteClassByValue: PitchClass[][] = [
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
