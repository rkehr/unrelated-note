"use client";

import { useEffect, useState } from "react";
import { Hourglass } from "lucide-react";
import { useOptions } from "@/hooks/useOptions";

interface TimerButtonProps {
  onTimerComplete: () => void;
}

export default function TimerButton({ onTimerComplete }: TimerButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const { options } = useOptions();
  const duration = options.timerSec;

  useEffect(() => {
    if (!isActive) return;

    let startTime = Date.now();
    const durationMs = duration * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / durationMs) * 100, 100);

      if (newProgress >= 100) {
        onTimerComplete();
        setProgress(0);
        startTime = Date.now();
      } else {
        setProgress(newProgress);
      }
    }, 64);

    return () => clearInterval(interval);
  }, [isActive, duration, onTimerComplete]);

  const handleClick = () => {
    setIsActive(!isActive);
    setProgress(0);
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex justify-center items-center h-12 w-12 bg-background text-foreground border-3 border-foreground rounded-full transition-colors hover:text-background hover:bg-foreground cursor-pointer overflow-hidden"
    >
      <div
        className="absolute bg-purple-800/30 inset-0 z-50 rounded-full  transition-transform duration-150 ease-linear"
        style={{
          transform: `scale(${progress / 100})`,
        }}
      />

      <Hourglass className="relative z-10" />
    </button>
  );
}
