"use client";
import FretBoard from "@/components/FretBoard";
import { HighlightedFret } from "@/components/FretBoardString";
import KeyBoard from "@/components/KeyBoard";
import { Pitch, pitchClassToLabel, toPitchClass } from "@/utils/functions";
import { applyScale, SCALES, valueToOklch } from "@/lib/scales";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOptions } from "@/hooks/useOptions";
import OptionPageDialog from "@/components/OptionPage";

export default function FretBoardExplorer() {
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [selectedScale, setSelectedScale] =
    useState<keyof typeof SCALES>("MAJOR");

  const [tempPitch, setTempPitch] = useState<Pitch | null>(null);

  const highlights: HighlightedFret[] = [];
  if (tempPitch) {
    highlights.push({
      color: valueToOklch(tempPitch.value),
      value: toPitchClass(tempPitch),
      label: pitchClassToLabel(tempPitch),
    });
  }

  const currentScale = useMemo(() => {
    if (!selectedPitch) {
      return;
    }
    return applyScale(selectedPitch, SCALES[selectedScale]);
  }, [selectedPitch, selectedScale]);

  const { options } = useOptions();

  if (currentScale) {
    currentScale.forEach((pitchClass, index) => {
      highlights.push({
        color: valueToOklch(pitchClass.value),
        value: pitchClass,
        label:
          index === 0 || !options.pearlColorByDegree
            ? pitchClassToLabel(pitchClass)
            : index + 1 + "",
      });
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center px-8">
        <h2 className="text-2xl font-bold ">fretboard explorer</h2>
        <OptionPageDialog />
      </div>
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
