"use client";

import { useEffect, useState } from "react";
import { accidentalUnicode, pitchToLabel } from "./PitchLabel";
import { Button } from "./ui/button";
import { pitchClassToLabel } from "./PitchClassLabel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import FretBoard from "./FretBoard";
import { HighlightedFret } from "./FretBoardString";
import PitchDetector from "./PitchDetector";
import MidiNoteStave from "./MidiNoteStave";
import { CheckCircle } from "lucide-react";
import PitchStringView from "./PitchStringView";

export default function RandomNotes() {
  const [numNotes, setNumNotes] = useState(8);
  const [currentNotes, setCurrentNotes] = useState<number[]>([69, 69, 69, 69]);
  const [correctlyPlayedIndex, setCorrectlyPlayedIndex] = useState<number>(-1);

  useEffect(() => {
    setCurrentNotes(generateNotes(numNotes));
  }, [numNotes]);

  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(
    null,
  );
  const [tempNoteIndex, setTempNoteIndex] = useState<number | null>(null);

  const [preferFlats, setPreferFlats] = useState<boolean>(true);

  const [isStrict, setIsStrict] = useState<boolean>(false);
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

  const handlePitchChange = (value: number | null) => {
    if (value === null) {
      return;
    }
    const targetNote = currentNotes[correctlyPlayedIndex + 1];
    if (value % 12 === targetNote % 12) {
      if (correctlyPlayedIndex + 1 === currentNotes.length - 1) {
        handleGenerateNewNotes();
        setCorrectlyPlayedIndex(-1);
        return;
      }
      setCorrectlyPlayedIndex(correctlyPlayedIndex + 1);
      setSelectedNoteIndex(correctlyPlayedIndex + 2);
    } else {
      if (isStrict) {
        setCorrectlyPlayedIndex(-1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full justify-between">
      <div
        className={`bg-white transition-opacity ${hideStave ? "opacity-0" : ""}`}
      >
        <MidiNoteStave notes={currentNotes} preferFlats={preferFlats} />
      </div>

      <div
        className={`text-5xl font-bold flex justify-evenly align-baseline gap-16 shrink-0 `}
      >
        <PitchDetector
          onConfidentPitchChange={handlePitchChange}
          onImmediatePitchChange={() => {}}
          formatMidiNote={(value) => {
            return formatMidiNote(value, preferFlats);
          }}
        />

        <PitchStringView
          notes={currentNotes}
          preferFlats={preferFlats}
          hide={hideNames}
          selectedNoteIndex={selectedNoteIndex}
          tempNoteIndex={tempNoteIndex}
          selectedColor={selectedColor}
          tempColor={tempColor}
          correctlyPlayedIndex={correctlyPlayedIndex}
          setSelectedNoteIndex={setSelectedNoteIndex}
          setTempNoteIndex={setSelectedNoteIndex}
        />
      </div>

      <FretBoard highlighted={highlights} />

      <Button className="w-full max-w-lg" onClick={handleGenerateNewNotes}>
        generate!
      </Button>

      <Collapsible className="w-full max-w-lg mt-4 mx-4">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            options
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex justify-between gap-4 w-full p-8">
            <Button
              className=""
              onClick={() => setViewMode((viewMode + 1) % viewModes.length)}
            >
              view: {viewModes[viewMode]}
            </Button>
            <Button className="" onClick={() => setIsStrict(!isStrict)}>
              pitch detection: {isStrict ? "strict" : "lenient"}
            </Button>
            <Button className="" onClick={() => setPreferFlats(!preferFlats)}>
              prefer: {accidentalUnicode[preferFlats ? "b" : "#"]}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const viewModes = ["both", "stave"];

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

const formatMidiNote = (value: number | null, preferFlats: boolean) => {
  if (value === null) {
    return null;
  }
  const pitch = valueToNote(value, {
    prefer: preferFlats ? "flats" : "sharps",
    forceNaturals: true,
  });
  return pitchToLabel(pitch);
};

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

export type NoteLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "B";
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
