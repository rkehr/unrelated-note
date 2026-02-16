"use client";
import { Pitch, pitchClassToLabel, valueToNote } from "@/utils/functions";
import { useState } from "react";

interface KeyBoardProps {
  onKeyClick?: (pitch: Pitch) => void;
  onKeyMouseEnter?: (pitch: Pitch) => void;
  onKeyMouseLeave?: (pitch: Pitch) => void;
}

export default function KeyBoard(props: KeyBoardProps) {
  const { onKeyClick, onKeyMouseEnter, onKeyMouseLeave } = props;

  return (
    <div className="w-full h-64 flex text-center inset-shadow-sm relative">
      {[...Array(12).keys()].map((index) => (
        <Key
          key={index}
          pitchIndex={index}
          onClick={onKeyClick}
          onMouseEnter={onKeyMouseEnter}
          onMouseLeave={onKeyMouseLeave}
        />
      ))}
    </div>
  );
}

interface KeyProps {
  pitchIndex: number;
  onClick?: (pitch: Pitch) => void;
  onMouseEnter?: (pitch: Pitch) => void;
  onMouseLeave?: (pitch: Pitch) => void;
}
function Key(props: KeyProps) {
  const { pitchIndex, onClick, onMouseEnter, onMouseLeave } = props;
  const pitch = keyBoardOctave[pitchIndex];
  const isNatural = pitch.accidental === "";

  return (
    <button
      className={`${isNatural ? whiteKeyBase : blackKeyBase} rounded-b-lg cursor-pointer hover:rotate-x-6`}
      style={!isNatural ? { left: `${pitchIndex * 8.33333}%` } : {}}
      onClick={() => {
        onClick?.(pitch);
      }}
      onMouseEnter={() => {
        onMouseEnter?.(pitch);
      }}
      onMouseLeave={() => {
        onMouseLeave?.(pitch);
      }}
    >
      <KeyLabel pitch={keyBoardOctave[pitchIndex]} />
    </button>
  );
}

interface KeyLabelProps {
  pitch: Pitch;
}
function KeyLabel(props: KeyLabelProps) {
  const { pitch } = props;
  const label = pitchClassToLabel(pitch);
  return <div className="absolute bottom-4 left-0 right-0">{label}</div>;
}
const c3 = 48;
const whiteKeyBase = "w-[14.28%] h-full border relative shadow-lg";
const blackKeyBase =
  "w-[8.33333%] absolute top-0 h-8/12 bg-foreground text-background z-10 shadow-lg ";

const keyBoardOctave: Pitch[] = Array(12)
  .fill(0)
  .map((_, index) => {
    return index + c3;
  })
  .map((value) => valueToNote(value, { prefer: "flats", forceNaturals: true }));
