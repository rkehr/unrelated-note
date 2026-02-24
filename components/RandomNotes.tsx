"use client";

import { useEffect, useState } from "react";
import FretBoard from "./FretBoard";
import { HighlightedFret } from "./FretBoardString";
import PitchDetector from "./PitchDetector";
import MidiNoteStave from "./MidiNoteStave";
import { useWakeLock } from "react-screen-wake-lock";
import { RefreshCcwDot } from "lucide-react";
import {
  formatMidiNote,
  generateNotes,
  highlightFromValue,
  noteRange as defaultNoteRange,
  Range,
  PitchClass,
  valueToNote,
  toPitchClass,
} from "@/utils/functions";
import OptionPageDialog from "./OptionPage";
import { useOptions } from "@/hooks/useOptions";
import TimerButton from "./TimerButton";

export default function RandomNotes() {
  const [noteRange, setNoteRange] = useState<Range>(defaultNoteRange);
  const [currentNotes, setCurrentNotes] = useState<number[]>([69, 69, 69, 69]);
  const [correctlyPlayedIndex, setCorrectlyPlayedIndex] = useState<number>(-1);
  const { options } = useOptions();

  useWakeLock({ reacquireOnPageVisible: true });

  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(
    null,
  );
  const [tempNoteIndex, setTempNoteIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<PitchClass | null>(null);

  const handleGenerateNewNotes = () => {
    setCurrentNotes(generateNotes(options.numNotes, noteRange));
    setCorrectlyPlayedIndex(-1);
    setSelectedNoteIndex(null);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleGenerateNewNotes();
  }, [options.numNotes, noteRange]);

  const highlights: HighlightedFret[] = [];

  const selectedColor = "#77AACC";
  const tempColor = "#AA77CC";

  if (
    tempNoteIndex !== null &&
    typeof currentNotes[tempNoteIndex] !== "undefined"
  ) {
    highlights.push(
      highlightFromValue(
        currentNotes[tempNoteIndex],
        tempColor,
        options.preferFlats,
      ),
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
        options.preferFlats,
      ),
    );
  }
  if (selected !== null) {
    highlights.push(
      highlightFromValue(selected.value, selectedColor, options.preferFlats),
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
        return;
      }
      setCorrectlyPlayedIndex(correctlyPlayedIndex + 1);
      if (options.showNextNoteLocation) {
        setSelectedNoteIndex(correctlyPlayedIndex + 2);
      }
    } else {
      if (options.isStrict) {
        setCorrectlyPlayedIndex(-1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full justify-between">
      <div className="w-full flex justify-between items-center px-8 py-8">
        <h2 className="text-2xl font-bold ">random note sequence</h2>
        <OptionPageDialog />
      </div>
      <div className={`w-full max-w-250`}>
        <div className="flex gap-2 ml-4 justify-start">
          <PitchDetector
            onPitchChange={handlePitchChange}
            formatMidiNote={(value) => {
              return formatMidiNote(value, options.preferFlats);
            }}
          />
          <TimerButton
            onTimerComplete={() => {
              handleGenerateNewNotes();
            }}
          />
          <button
            onClick={handleGenerateNewNotes}
            className={`flex justify-center items-center h-12 w-12 bg-foreground text-background border-3 border-foreground rounded-full transition-colors hover:text-foreground hover:bg-background cursor-pointer`}
          >
            <RefreshCcwDot />
          </button>
        </div>

        <MidiNoteStave
          notes={currentNotes}
          preferFlats={options.preferFlats}
          correctlyPlayedIndex={correctlyPlayedIndex}
        />
      </div>

      {/* <div */}
      {/*   className={`text-5xl font-bold flex justify-evenly align-baseline gap-16 shrink-0 `} */}
      {/* > */}
      {/*   <PitchStringView */}
      {/*     notes={currentNotes} */}
      {/*     preferFlats={options.preferFlats} */}
      {/*     hide={options.hideNoteNames} */}
      {/*     selectedNoteIndex={selectedNoteIndex} */}
      {/*     tempNoteIndex={tempNoteIndex} */}
      {/*     selectedColor={selectedColor} */}
      {/*     tempColor={tempColor} */}
      {/*     correctlyPlayedIndex={correctlyPlayedIndex} */}
      {/*     setSelectedNoteIndex={setSelectedNoteIndex} */}
      {/*     setTempNoteIndex={setSelectedNoteIndex} */}
      {/*   /> */}
      {/* </div> */}

      <FretBoard
        highlighted={highlights}
        onFretClick={(value, fret, stringIndex) => {
          if (fret === 0) {
            setNoteRange({ from: value, to: value + 12 });
          } else {
            setSelected(
              toPitchClass(
                valueToNote(value, {
                  prefer: options.preferFlats ? "flats" : "sharps",
                }),
              ),
            );
          }
        }}
      />
    </div>
  );
}
