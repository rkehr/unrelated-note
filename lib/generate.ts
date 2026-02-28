import { Pitch, PitchClass, valueToNote } from "@/utils/functions";
import { Scale } from "./scales";
import PRNG from "./rng";

interface RandomFromScaleOpts extends SeededNoteGeneratorBaseOptions {
  root: PitchClass;
  scale: Scale;
  generator: "randomFromScale";
}

function randomFromScale(opts: RandomFromScaleOpts) {
  const { numberOfNotes, range } = opts;
  const series = Array(numberOfNotes)
    .fill(0)
    .map(() => generateNote(range))
    .map((value) => valueToNote(value, { preferFlats: false }));

  return series;
}

interface FullyRandomOpts extends SeededNoteGeneratorBaseOptions {
  preferFlats: boolean;
  generator: "fullyRandom";
}

function fullyRandom(opts: FullyRandomOpts) {
  const { numberOfNotes, range, preferFlats, seed } = opts;
  const rng = new PRNG(seed);
  const series = Array(numberOfNotes)
    .fill(0)
    .map(() => rng.nextRange(range.from, range.to))
    .map((value) => valueToNote(value, { preferFlats }));

  return series;
}

interface NoRepeatRandomOpts extends SeededNoteGeneratorBaseOptions {
  preferFlats: boolean;
  generator: "noRepeatRandom";
}

function noRepeatRandom(opts: NoRepeatRandomOpts) {
  const { numberOfNotes, range, preferFlats, seed } = opts;
  const rng = new PRNG(seed);

  const available = Array.from(
    { length: range.to - range.from },
    (_, i) => range.from + i,
  );

  const series: Pitch[] = [];
  let pool = [...available];
  const usedClasses = new Set<number>();

  while (series.length < numberOfNotes) {
    if (pool.length === 0) {
      pool = [...available];
      usedClasses.clear();
    }

    const idx = rng.nextRange(0, pool.length);
    const value = pool[idx];
    const pitchClass = value % 12;

    if (!usedClasses.has(pitchClass)) {
      series.push(valueToNote(value, { preferFlats }));
      usedClasses.add(pitchClass);
      pool.splice(idx, 1);
    }
  }

  return series;
}

type NoteGeneratorOptions =
  | FullyRandomOpts
  | RandomFromScaleOpts
  | NoRepeatRandomOpts;

type NoteGeneratorMap = {
  [K in NoteGeneratorOptions["generator"]]: (
    opts: Extract<NoteGeneratorOptions, { generator: K }>,
  ) => Pitch[];
};

const NoteGenerators: NoteGeneratorMap = {
  fullyRandom,
  randomFromScale,
  noRepeatRandom,
};

interface NoteGeneratorBaseOptions {
  numberOfNotes: number;
  range: Range;
}
interface SeededNoteGeneratorBaseOptions extends NoteGeneratorBaseOptions {
  seed: string;
}

type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

type DistributiveOptional<T, K extends keyof T> = T extends unknown
  ? Omit<T, K> & Partial<Pick<T, K>>
  : never;

export function generateNotes(opts: NoteGeneratorOptions) {
  const { generator, seed } = opts;
  return NoteGenerators[generator]({
    ...opts,
    seed: seed ?? Date.now().toString(),
  } as never);
}

export function seedGenerationOptions(
  opts: DistributiveOptional<NoteGeneratorOptions, "seed">,
) {
  const { seed } = opts;
  return {
    ...opts,
    seed: seed ?? Date.now().toString(),
  } as NoteGeneratorOptions;
}

export function generateNote(range: Range) {
  const span = range.to - range.from;
  return Math.floor(Math.random() * span) + range.from;
}

export interface Range {
  from: number;
  to: number;
}

export const guitarNoteRange = { from: 52, to: 88 };
export const defaultNoteRange = { from: 60, to: 72 };
