import FretBoardString from "./FretBoardString";

export default function FretBoard() {
  const numFrets = 22;
  const fretSpaces = Array(numFrets - 1).fill(0);
  const frets = Array(numFrets).fill(0);
  const highlighted = [
    { label: "R", color: "#88ff88", pitchClass: 5 },
    { label: "m3", color: "#ff8888", pitchClass: 8 },
    { label: "5", color: "#8888ff", pitchClass: 0 },
    { label: "M7", color: "#ffff88", pitchClass: 4 },
    { label: "9", color: "#88ffff", pitchClass: 7 },
  ];
  return (
    <div>
      <h3>FretBoard</h3>
      <div className="relative h-40 flex flex-col justify-stretch">
        <div className="flex justify-evenly absolute inset-0">
          {fretSpaces.map((_, index) => {
            return (
              <div
                key={index}
                className="z-20 w-[3px] h-full bg-foreground opacity-50"
              />
            );
          })}
        </div>

        <FretBoardString
          rootValue={76}
          numFrets={numFrets}
          highlighted={highlighted}
        />
        <FretBoardString
          rootValue={71}
          numFrets={numFrets}
          highlighted={highlighted}
        />
        <FretBoardString
          rootValue={67}
          numFrets={numFrets}
          highlighted={highlighted}
        />
        <FretBoardString
          rootValue={62}
          numFrets={numFrets}
          highlighted={highlighted}
        />
        <FretBoardString
          rootValue={57}
          numFrets={numFrets}
          highlighted={highlighted}
        />
        <FretBoardString
          rootValue={52}
          numFrets={numFrets}
          highlighted={highlighted}
        />

        <div className="flex justify-stretch absolute inset-0">
          {frets.map((_, index) => {
            return (
              <div key={index} className="grow h-full relative">
                {[3, 5, 7, 9, 0].includes((index + 1) % 12) && (
                  <div className="absolute inset-0 opacity-90 flex flex-col gap-10 justify-center items-center">
                    <div className="w-4 h-4 rounded-full border-2 bg-background " />
                    {(index + 1) % 12 === 0 && (
                      <div className="w-4 h-4 rounded-full border-2 bg-background" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
