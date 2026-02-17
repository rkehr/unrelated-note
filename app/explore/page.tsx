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
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FretBoardExplorer() {
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [selectedScale, setSelectedScale] =
    useState<keyof typeof SCALES>("MAJOR");

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
    return applyScale(selectedPitch, SCALES[selectedScale]);
  }, [selectedPitch, selectedScale]);

  if (currentScale) {
    currentScale.forEach((pitchClass, index) => {
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
      <h2 className="text-2xl font-bold ml-8 mt-8">fretboard explorer</h2>
      <FretBoard highlighted={highlights} />

      <h3 className="text-xl font-bold ml-8 mt-8">select scale</h3>
      <Select
        value={selectedScale}
        onValueChange={(value) =>
          setSelectedScale(value as keyof typeof SCALES)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SCALES).map(([key, scale]) => (
            <SelectItem key={key} value={key}>
              {scale.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <h3 className="text-xl font-bold ml-8 mt-8">select root</h3>
      <KeyBoard
        onKeyClick={(pitch) => setSelectedPitch(pitch)}
        onKeyMouseEnter={(pitch) => setTempPitch(pitch)}
        onKeyMouseLeave={(pitch) => {
          if (tempPitch === pitch) {
            setTempPitch(null);
          }
        }}
      />

      <div className="opacity-50 flex justify-around m-4">
        <Link href="imprint">imprint</Link>
        <Link href="support">support</Link>
        <Link href="https://robinkehr.de/">@akaz</Link>
      </div>
    </div>
  );
}
