import { compare, Pitch, PitchClass } from "@/utils/functions";

interface FretBoardStringProps {
  rootValue?: number;
  numFrets?: number;
  highlighted: HighlightedFret[];
}

export default function FretBoardString(props: FretBoardStringProps) {
  const { rootValue = 60, numFrets = 12, highlighted = [] } = props;
  const selectedFrets = Array(numFrets + 1)
    .fill(false)
    .map((_, index) => {
      const hightlight = highlighted.find(({ value }) =>
        compare(rootValue + index, value),
      );
      return hightlight;
    });
  return (
    <div className="grow flex  justify-stretch w-full relative z-10">
      <div className="absolute top-1/2 left-0 right-0 bg-foreground h-[1px]" />

      {selectedFrets.map((highlight, index) => {
        return (
          <div
            key={index}
            className={
              index === 0 ? "absolute -left-9 w-8 top-3.5" : "grow relative"
            }
          >
            {highlight && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div
                  style={{ background: highlight.color }}
                  className={`w-6 h-6 rounded-full relative flex items-center justify-center shadow-xs text-background`}
                >
                  <div className=" text-xs font-bold relative top-[1px]">
                    {highlight.label}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export interface HighlightedFret {
  label: string;
  color: string;
  value: Pitch | PitchClass;
}
