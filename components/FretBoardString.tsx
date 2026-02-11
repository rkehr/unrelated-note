interface FretBoardStringProps {
  rootValue?: number;
  numFrets?: number;
  selectedClassValues?: number[];
  highlighted: HighlightedFret[];
}

export default function FretBoardString(props: FretBoardStringProps) {
  const {
    rootValue = 60,
    numFrets = 12,
    selectedClassValues = [4, 8, 11],
    highlighted = [],
  } = props;
  const selectedFrets = Array(numFrets)
    .fill(false)
    .map((_, index) => {
      selectedClassValues.includes(((rootValue % 12) + index + 1) % 12);
      const hightlight = highlighted.find(
        ({ pitchClass }) => ((rootValue % 12) + index + 1) % 12 === pitchClass,
      );
      return hightlight;
    });
  return (
    <div className="grow flex gap-1 justify-stretch w-full relative z-10">
      <div className="absolute top-1/2 left-0 right-0 bg-foreground h-[1px]" />

      {selectedFrets.map((highlight, index) => {
        return (
          <div key={index} className="grow relative">
            {highlight && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div
                  style={{ background: highlight.color }}
                  className={`w-5 h-5 rounded-full relative flex items-center justify-center`}
                >
                  <div className=" text-xs font-bold text-center">
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
  pitchClass: number;
}
