"use client";
import { useState } from "react";
import FretBoardString, { HighlightedFret } from "./FretBoardString";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { pitchToLabel, valueToNote } from "@/utils/functions";

interface FretBoardProps {
  highlighted?: HighlightedFret[];
}

export default function FretBoard(props: FretBoardProps) {
  const numFrets = 12;
  const fretSpaces = Array(numFrets - 1).fill(0);
  const frets = Array(numFrets).fill(0);
  const highlighted = props.highlighted ?? [];

  const [selectedTuning, setSelectedTuning] =
    useState<keyof typeof stringSets>("guitar standard");

  const stringSet = stringSets[selectedTuning].slice().reverse();
  return (
    <div className="w-full py-8 pr-4">
      <Select
        value={selectedTuning}
        onValueChange={(value) =>
          setSelectedTuning(value as keyof typeof stringSets)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(stringSets).map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative h-40 flex w-full">
        <div className="relative h-full flex flex-col justify-evenly px-2 ">
          {stringSet.map((value, index) => (
            <div key={index}>{pitchToLabel(valueToNote(value))}</div>
          ))}
        </div>
        <div className="relative h-full flex flex-col justify-stretch grow">
          <div className="flex justify-evenly absolute inset-0">
            {fretSpaces.map((_, index) => {
              return (
                <div
                  key={index}
                  className="z-20 w-[3px] mt-3.5 h-10/12 bg-foreground opacity-50"
                />
              );
            })}
          </div>

          {stringSet.map((value, index) => (
            <FretBoardString
              key={index}
              rootValue={value}
              numFrets={numFrets}
              highlighted={highlighted}
            />
          ))}

          <div className="flex justify-stretch absolute inset-0">
            {frets.map((_, index) => {
              return (
                <div key={index} className="grow h-full relative">
                  {[3, 5, 7, 9, 0].includes((index + 1) % 12) && (
                    <div className="absolute inset-0 opacity-90 flex flex-col gap-10 justify-center items-center">
                      <div className="w-4 h-4 rounded-full border-2 bg-background " />
                      {(index + 1) % 12 === 0 && (
                        <div className="w-4 h-4 rounded-full border-2 bg-background" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const hightlightExample = [
  { label: "R", color: "#88ff88", pitchClass: 5 },
  { label: "M3", color: "#ff8888", pitchClass: 9 },
  { label: "5", color: "#8888ff", pitchClass: 0 },
  { label: "M7", color: "#ffff88", pitchClass: 4 },
  { label: "9", color: "#88ffff", pitchClass: 7 },
];

const stringSets = {
  "guitar standard": [52, 57, 62, 67, 71, 76],
  "guitar drop d": [50, 57, 62, 67, 71, 76],
  "guitar dadgad": [50, 57, 62, 67, 69, 74],
  "guitar open g": [50, 55, 62, 67, 71, 74],
  "guitar open d": [50, 57, 62, 66, 69, 74],
  "guitar open c": [48, 55, 60, 67, 72, 76],
  "bass standard": [40, 45, 50, 55],
  "bass drop d": [38, 45, 50, 55],
  "bass 5 string": [35, 40, 45, 50, 55],
  "ukulele standard": [79, 72, 76, 81],
  charango: [79, 72, 76, 81, 88],
  mandolin: [55, 62, 69, 76],
};
