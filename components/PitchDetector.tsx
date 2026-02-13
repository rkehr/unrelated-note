"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Pitchfinder from "pitchfinder";
import { AudioWaveform, Ear } from "lucide-react";

interface PitchDetectorProps {
  onImmediatePitchChange: (value: number | null) => void;
  onConfidentPitchChange: (value: number | null) => void;
  formatMidiNote: (value: number | null) => ReactNode;
}

function PitchDetector(props: PitchDetectorProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const detectPitchRef = useRef<
    ((float32Array: Float32Array) => number | null) | null
  >(null);
  const [previousMidiNote, setPreviousMidiNote] = useState<number | null>(null);
  const noteCounterRef = useRef<{ note: number | null; count: number }>({
    note: null,
    count: 0,
  });
  const CONFIDENCE_THRESHOLD = 16; // ~130ms at 60fps

  const { onConfidentPitchChange, onImmediatePitchChange } = props;

  const onConfidentPitchChangeRef = useRef(onConfidentPitchChange);
  const onImmediatePitchChangeRef = useRef(onConfidentPitchChange);

  useEffect(() => {
    onConfidentPitchChangeRef.current = onConfidentPitchChange;
    onImmediatePitchChangeRef.current = onConfidentPitchChange;
  }, [onConfidentPitchChange, onImmediatePitchChange]);

  // Convert frequency (Hz) to MIDI note number
  const frequencyToMidi = (frequency: number): number => {
    return Math.round(12 * Math.log2(frequency / 440) + 69);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const detectPitch = Pitchfinder.YIN({
        sampleRate: audioContext.sampleRate,
      });
      detectPitchRef.current = detectPitch;

      setIsListening(true);
      setError(null);

      detectPitchLoop();
    } catch (err) {
      setError("Failed to access microphone. Please grant permission.");
      console.error("Microphone access error:", err);
    }
  };

  const detectPitchLoop = () => {
    if (!analyserRef.current || !detectPitchRef.current) return;

    const analyser = analyserRef.current;
    const detectPitch = detectPitchRef.current;

    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);

    const detect = () => {
      analyser.getFloatTimeDomainData(buffer);

      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i] * buffer[i];
      }
      const rms = Math.sqrt(sum / buffer.length);
      const db = 20 * Math.log10(rms);
      const level = Math.max(0, Math.min(1, (db + 60) / 60));
      setLevel(level);

      const frequency = detectPitch(buffer);

      let currentMidiNote: number | null = null;

      if (frequency && frequency > 0) {
        const midiNote = frequencyToMidi(frequency);
        if (midiNote >= 0 && midiNote <= 127) {
          currentMidiNote = midiNote;
        }
      }

      if (currentMidiNote === noteCounterRef.current.note) {
        noteCounterRef.current.count++;
        if (noteCounterRef.current.count === CONFIDENCE_THRESHOLD) {
          onConfidentPitchChangeRef.current(currentMidiNote);
        }
      } else {
        noteCounterRef.current = { note: currentMidiNote, count: 1 };
        setPreviousMidiNote(currentMidiNote);
        onImmediatePitchChangeRef.current(currentMidiNote);
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    detectPitchRef.current = null;
    setPreviousMidiNote(null);
    setIsListening(false);
    setLevel(0);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <div className="pitch-detector">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`text-xl flex justify-center items-center relative overflow-clip h-12 w-12 bg-background text-foreground border-3 border-foreground rounded-full transition-colors hover:text-background ${isListening ? "hover:bg-red-900" : "hover:bg-green-900"} `}
      >
        <div className="relative z-10">
          {isListening ? (
            previousMidiNote === null ? (
              <Ear />
            ) : (
              props.formatMidiNote(previousMidiNote)
            )
          ) : (
            <AudioWaveform />
          )}
        </div>
        <div
          className="bg-green-600 absolute h-full left-0 right-0 bottom-0 transition-all duration-300 ease-out opacity-50 z-1"
          style={{ height: `${level * 100}%` }}
        />
      </button>

      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}

export default PitchDetector;
