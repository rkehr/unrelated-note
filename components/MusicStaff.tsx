"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Factory } from "vexflow";

interface MusicStaffProps {
  notes: string;
  width?: number;
  height?: number;
  clef?: "treble" | "bass" | "alto" | "tenor" | "percussion";
  timeSignature?: string;
}

export default function MusicStaff({
  notes,
  width = 500,
  height = 200,
  clef = "treble",
  timeSignature = "4/4",
}: MusicStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = useId();

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    try {
      const factory = new Factory({
        renderer: {
          elementId: containerId,
          width,
          height,
        },
      });

      const ctx = factory.getContext();
      ctx.scale(2, 2);
      const score = factory.EasyScore();
      const staveNotes = score.notes(notes);
      const system = factory.System({ width: 220 });

      system
        .addStave({
          voices: [score.voice(staveNotes)],
        })
        .addClef(clef)
        .addTimeSignature(timeSignature);

      factory.draw();
    } catch (error) {
      console.error("Error rendering VexFlow notation:", error);
    }
  }, [notes, width, height, clef, timeSignature, containerId]);

  return <div ref={containerRef} id={containerId} />;
}
