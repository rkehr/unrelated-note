"use client";

import { useCallback, useEffect, useState } from "react";
import FretBoard from "./FretBoard";
import { HighlightedFret } from "./FretBoardString";
import PitchDetector from "./PitchDetector";
import MidiNoteStave from "./MidiNoteStave";
import { useWakeLock } from "react-screen-wake-lock";
import { ListChevronsDownUp, Music, RefreshCcwDot } from "lucide-react";
import {
  formatMidiNote,
  Range,
  PitchClass,
  valueToNote,
  toPitchClass,
  Pitch,
  highlightFromPitchClass,
} from "@/utils/functions";
import OptionPageDialog from "./OptionPage";
import { useOptions } from "@/hooks/useOptions";
import TimerButton from "./TimerButton";
import {
  defaultNoteRange,
  generateNotes,
  seedGenerationOptions,
} from "@/lib/generate";

export default function RandomNotes() {
  const [noteRange, setNoteRange] = useState<Range>(defaultNoteRange);
  const [currentNotes, setCurrentNotes] = useState<Pitch[]>([]);
  const [correctlyPlayedIndex, setCorrectlyPlayedIndex] = useState<number>(-1);
  const { options } = useOptions();
  const { preferFlats } = options;

  const wakelock = useWakeLock({ reacquireOnPageVisible: true });
  useEffect(() => {
    if (typeof wakelock.type === "undefined") {
      wakelock.request();
    }
  }, [wakelock]);

  const [fretboardSelection, setFretboardSelection] =
    useState<PitchClass | null>(null);

  const handleGenerateNewNotes = useCallback(() => {
    setCurrentNotes(
      generateNotes(
        seedGenerationOptions({
          numberOfNotes: options.numNotes,
          range: noteRange,
          generator: "noRepeatRandom",
          preferFlats,
        }),
      ),
    );
    setCorrectlyPlayedIndex(-1);
  }, [
    noteRange,
    options.numNotes,
    setCurrentNotes,
    setCorrectlyPlayedIndex,
    preferFlats,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleGenerateNewNotes();
  }, [options.numNotes, noteRange]);

  const highlights: HighlightedFret[] = [];

  const targetIndex = correctlyPlayedIndex + 1;
  if (
    options.showNextNoteLocation &&
    typeof currentNotes[targetIndex] !== "undefined"
  ) {
    highlights.push(highlightFromPitchClass(currentNotes[targetIndex]));
  }
  if (fretboardSelection !== null) {
    highlights.push(highlightFromPitchClass(fretboardSelection));
  }

  const handlePitchChange = (value: number | null) => {
    if (value === null) {
      return;
    }
    const targetNote = currentNotes[targetIndex];

    if (value === targetNote.value) {
      if (targetIndex === currentNotes.length - 1) {
        handleGenerateNewNotes();
        return;
      }
      setCorrectlyPlayedIndex(targetIndex);
      return;
    }
    if (options.isStrict) {
      setCorrectlyPlayedIndex(-1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full justify-between">
      <div className="w-full flex justify-between items-center px-8 py-8">
        <h2 className="text-2xl font-bold ">random note sequence</h2>
        <OptionPageDialog />
      </div>
      <div className={`w-full max-w-250`}>
        <div className="flex gap-2 mx-4 justify-between">
          <div className="flex gap-2 ">
            <PitchDetector
              onPitchChange={handlePitchChange}
              formatMidiNote={(value) => {
                return formatMidiNote(value, preferFlats);
              }}
            />
            <TimerButton onTimerComplete={handleGenerateNewNotes} />
            <button
              onClick={handleGenerateNewNotes}
              className={`flex justify-center items-center h-12 w-12 bg-foreground text-background border-3 border-foreground rounded-full transition-colors hover:text-foreground hover:bg-background cursor-pointer`}
            >
              <RefreshCcwDot />
            </button>
          </div>
          <div className="flex gap-2 ">
            <button
              className={`flex justify-center items-center h-12 w-12 bg-foreground text-background border-3 border-foreground rounded-full transition-colors hover:text-foreground hover:bg-background cursor-pointer`}
            >
              <ListChevronsDownUp />
            </button>
            <button
              className={`flex justify-center items-center h-12 w-12 bg-foreground text-background border-3 border-foreground rounded-full transition-colors hover:text-foreground hover:bg-background cursor-pointer`}
            >
              <Music />
            </button>
          </div>
        </div>

        <MidiNoteStave
          notes={currentNotes}
          preferFlats={preferFlats}
          correctlyPlayedIndex={correctlyPlayedIndex}
        />
      </div>

      <FretBoard
        highlighted={highlights}
        onFretClick={(value, fret, stringIndex) => {
          if (fret === 0) {
            setNoteRange({ from: value, to: value + 13 });
          } else {
            setFretboardSelection(
              toPitchClass(
                valueToNote(value, {
                  preferFlats,
                }),
              ),
            );
          }
        }}
      />
    </div>
  );
}
