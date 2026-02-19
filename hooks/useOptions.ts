"use client";
import { stringSets } from "@/components/FretBoard";
import { useState, useEffect } from "react";

export interface Options {
  hideNoteNames: boolean;
  showNextNoteLocation: boolean;
  isStrict: boolean;
  fretBoardLayout: keyof typeof stringSets;
  numNotes: number;
  pearlColorByDegree: boolean;
  preferFlats: boolean;
  preventRepeats: boolean;
}

const defaultOptions: Options = {
  hideNoteNames: false,
  showNextNoteLocation: false,
  isStrict: false,
  preferFlats: false,
  pearlColorByDegree: false,
  fretBoardLayout: "guitar standard",
  numNotes: 8,
  preventRepeats: false,
};

export function useOptions() {
  const [options, setOptionsState] = useState<Options>(defaultOptions);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("options");
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptionsState({ ...defaultOptions, ...JSON.parse(stored) });
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "options" && e.newValue) {
        setOptionsState({ ...defaultOptions, ...JSON.parse(e.newValue) });
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setOptions = (changes: Partial<Options>) => {
    const updated = { ...options, ...changes };
    setOptionsState(updated);
    localStorage.setItem("options", JSON.stringify(updated));

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "options",
        newValue: JSON.stringify(updated),
      }),
    );
  };

  return { options, setOptions };
}
