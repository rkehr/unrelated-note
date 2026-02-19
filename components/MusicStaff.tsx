"use client";
import { useOptions } from "@/hooks/useOptions";
import { useEffect, useId, useRef } from "react";
import { Annotation, BarlineType, Factory, Font } from "vexflow";

interface MusicStaffProps {
  notes: string;
  labels?: string[];
  width?: number;
  height?: number;
  clef?: "treble" | "bass" | "alto" | "tenor" | "percussion";
  timeSignature?: string;
  correctlyPlayedIndex?: number;
}

export default function MusicStaff(props: MusicStaffProps) {
  const {
    notes,
    labels,
    width = 600,
    height = 100,
    clef = "treble",
    timeSignature = "4/4",
    correctlyPlayedIndex,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = useId();
  const { options } = useOptions();
  const { hideNoteNames } = options;

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const measuresPerRow = 2;
    const measures = notes.split(", |, ");
    const numRows = Math.ceil(measures.length / measuresPerRow);

    const f = new Factory({
      renderer: {
        elementId: containerId,
        width,
        height: numRows * 125,
      },
    });
    const score = f.EasyScore();

    const margin = 20;
    const usableWidth = width - 2 * 20;
    const clefReserve = 0;

    let x = margin;
    let y = -10;

    function appendSystem(width: number) {
      const system = f.System({ x, y, width });
      x += width;
      return system;
    }
    function newLine() {
      x = margin;
      y += 100;
    }

    score.set({ time: timeSignature });

    measures.forEach((easyScore, measureIndex) => {
      const isFirstMeasure = measureIndex === 0;
      const isLastMeasure = measureIndex === measures.length - 1;
      const isFirstRow = measureIndex < measuresPerRow;

      let measureWidth = usableWidth / measuresPerRow;
      if (isFirstRow) {
        measureWidth = (usableWidth - clefReserve) / measuresPerRow;
      }
      if (isFirstMeasure) {
        measureWidth += clefReserve;
      }

      if (measureIndex % measuresPerRow === 0 && !isFirstMeasure) {
        newLine();
      }
      const system = appendSystem(measureWidth);
      const notes = score.notes(easyScore);
      notes.forEach((note, noteIndex) => {
        const index = measureIndex * 4 + noteIndex;
        const label = labels?.[index];
        let color = hideNoteNames ? "transparent" : "black";
        if (index <= (correctlyPlayedIndex ?? -1)) {
          color = "green";
        }

        if (label) {
          note.addModifier(annotation(label, color));
        }
      });

      const stave = system.addStave({
        voices: [score.voice(notes)],
      });
      if (isFirstMeasure) {
        stave.addClef(clef).addTimeSignature(timeSignature);
      }
      if (isLastMeasure) {
        stave.setEndBarType(BarlineType.END);
      }
    });

    f.draw();
  }, [
    notes,
    width,
    height,
    clef,
    timeSignature,
    containerId,
    labels,
    hideNoteNames,
    correctlyPlayedIndex,
  ]);

  return <div ref={containerRef} id={containerId} />;
}

const FONT_SIZE = 16;
const annotation = (text: string, color: string) =>
  new Annotation(text)
    .setStyle({ fillStyle: color })
    .setFontSize(FONT_SIZE)
    .setVerticalJustification(Annotation.VerticalJustify.BOTTOM);
