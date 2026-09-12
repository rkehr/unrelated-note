"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Pitchfinder from "pitchfinder";
import { AudioWaveform, Ear } from "lucide-react";

interface PitchDetectorProps {
  onPitchChange: (value: number | null) => void;
  formatMidiNote: (value: number | null) => ReactNode;
}

const frequencyToMidi = (frequency: number): number => {
  return 12 * Math.log2(frequency / 440) + 69;
};

function PitchDetector(props: PitchDetectorProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [deviation, setDeviation] = useState(0);

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
  const CONFIDENCE_THRESHOLD = 2;
  const { onPitchChange } = props;

  const onPitchChangeRef = useRef(onPitchChange);

  useEffect(() => {
    onPitchChangeRef.current = onPitchChange;
  }, [onPitchChange]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const detectPitch = Pitchfinder.YIN({
        sampleRate: audioContext.sampleRate,
        threshold: 0.005,
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
        const note = frequencyToMidi(frequency);
        const midiNote = Math.round(note);
        const deviation = note - midiNote;
        const noteDeviation = deviation < 0.5 ? deviation : -1 + deviation;
        if (midiNote >= 0 && midiNote <= 127) {
          currentMidiNote = midiNote;
          setDeviation(noteDeviation);
        }
      }

      if (currentMidiNote === noteCounterRef.current.note) {
        noteCounterRef.current.count++;
        if (noteCounterRef.current.count === CONFIDENCE_THRESHOLD) {
          onPitchChangeRef.current(currentMidiNote);
          setPreviousMidiNote(currentMidiNote);
        }
      } else {
        noteCounterRef.current = { note: currentMidiNote, count: 1 };
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
        className={`text-xl flex justify-center items-center cursor-pointer relative overflow-clip h-12 w-12 bg-background text-foreground border-3 border-foreground rounded-full transition-colors hover:text-background ${isListening ? "hover:bg-red-900" : "hover:bg-green-900"} `}
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
        <div
          className="absolute inset-0 flex items-start justify-center transition-transform duration-150"
          style={{ transform: `rotate(${deviation * 90}deg)` }}
        >
          <div
            className={`${Math.abs(deviation) < 0.02 ? "bg-green-600" : "bg-red-900"} ${previousMidiNote === null ? "opacity-0" : "opacity-100"} w-1 h-1 rounded-full transition-all origin-[50%_100%] duration-300 ease-out`}
            // style={{ transform: `rotate(${deviation * 90}deg)` }}
          />
        </div>
      </button>

      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}

export default PitchDetector;
