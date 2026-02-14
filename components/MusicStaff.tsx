"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Barline, Factory, Registry, System } from "vexflow";

interface MusicStaffProps {
  notes: string;
  width?: number;
  height?: number;
  clef?: "treble" | "bass" | "alto" | "tenor" | "percussion";
  timeSignature?: string;
}

export default function MusicStaff({
  notes,
  width = 600,
  height = 100,
  clef = "treble",
  timeSignature = "4/4",
}: MusicStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = useId();

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
        height: numRows * 100,
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

    measures.forEach((notes, index) => {
      const isFirstMeasure = index === 0;
      const isLastMeasure = index === measures.length - 1;
      const isFirstRow = index < measuresPerRow;

      let measureWidth = usableWidth / measuresPerRow;
      if (isFirstRow) {
        measureWidth = (usableWidth - clefReserve) / measuresPerRow;
      }
      if (isFirstMeasure) {
        measureWidth += clefReserve;
      }

      if (index % measuresPerRow === 0 && !isFirstMeasure) {
        newLine();
      }
      const system = appendSystem(measureWidth);

      const stave = system.addStave({
        voices: [score.voice(score.notes(notes))],
      });
      if (isFirstMeasure) {
        stave.addClef(clef).addTimeSignature(timeSignature);
      }
      if (isLastMeasure) {
        stave.addEndModifier(new Barline("end"));
      }
    });

    f.draw();
  }, [notes, width, height, clef, timeSignature, containerId]);

  return <div ref={containerRef} id={containerId} />;
}
