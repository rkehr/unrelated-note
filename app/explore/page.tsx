"use client";
import FretBoard from "@/components/FretBoard";
import { HighlightedFret } from "@/components/FretBoardString";
import KeyBoard from "@/components/KeyBoard";
import { Pitch, pitchClassToLabel } from "@/utils/functions";
import {
  applyScale,
  pitchClassValue,
  SCALES,
  valueToOklch,
} from "@/lib/scales";
import { useEffect, useMemo, useState } from "react";

export default function FretBoardExplorer() {
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [tempPitch, setTempPitch] = useState<Pitch | null>(null);

  const highlights: HighlightedFret[] = [];
  if (tempPitch) {
    highlights.push({
      color: valueToOklch(tempPitch.value % 12),

      pitchClass: tempPitch.value % 12,
      label: pitchClassToLabel(tempPitch),
    });
  }

  const currentScale = useMemo(() => {
    if (!selectedPitch) {
      return;
    }
    return applyScale(selectedPitch, SCALES.MAJOR);
  }, [selectedPitch]);

  if (currentScale) {
    currentScale.forEach((pitchClass, index) => {
      if (index % 2 !== 0) {
        return;
      }
      const value = pitchClassValue(pitchClass);
      highlights.push({
        color: valueToOklch(value),
        pitchClass: value,
        label: index === 0 ? pitchClassToLabel(pitchClass) : index + 1 + "",
      });
    });
  }

  return (
    <div>
      <KeyBoard
        onKeyClick={(pitch) => setSelectedPitch(pitch)}
        onKeyMouseEnter={(pitch) => setTempPitch(pitch)}
        onKeyMouseLeave={(pitch) => {
          if (tempPitch === pitch) {
            setTempPitch(null);
          }
        }}
      />
      <FretBoard highlighted={highlights} />
    </div>
  );
}
