import { CheckCircle } from "lucide-react";
import { valueToNote } from "./RandomNotes";
import { pitchClassToLabel } from "./PitchClassLabel";
import { Dispatch, SetStateAction } from "react";

interface PitchStringViewProps {
  notes: number[];
  preferFlats: boolean;
  selectedNoteIndex: number | null;
  tempNoteIndex: number | null;
  selectedColor: string;
  tempColor: string;
  correctlyPlayedIndex: number;
  setSelectedNoteIndex: Dispatch<SetStateAction<number | null>>;
  setTempNoteIndex: Dispatch<SetStateAction<number | null>>;
  hide: boolean;
}

export default function PitchStringView(props: PitchStringViewProps) {
  const {
    notes,
    preferFlats,
    selectedNoteIndex,
    tempNoteIndex,
    selectedColor,
    tempColor,
    correctlyPlayedIndex,
    setSelectedNoteIndex,
    setTempNoteIndex,
    hide,
  } = props;

  const pitches = notes.map((pitch) =>
    valueToNote(pitch, {
      prefer: preferFlats ? "flats" : "sharps",
      forceNaturals: true,
    }),
  );

  const pitchClassLabels = pitches.map(pitchClassToLabel);
  const labelGroups = Array(Math.floor(notes.length / 4))
    .fill(0)
    .map((_, index) => {
      return pitchClassLabels.slice(index * 4, index * 4 + 4);
    });
  console.log(labelGroups);
  return (
    <div className="flex flex-wrap align-center gap-x-16 gap-y-4">
      {labelGroups.map((group, groupIndex) => {
        return (
          <div key={groupIndex} className="flex gap-4">
            {group.map((pitchClassLabel, labelIndex) => {
              const index = groupIndex * 4 + labelIndex;
              const isSelected = selectedNoteIndex === index;
              const isTemp = tempNoteIndex === index;
              const color = isTemp
                ? tempColor
                : isSelected
                  ? selectedColor
                  : undefined;
              const isPlayed = index <= correctlyPlayedIndex;
              return (
                <div
                  key={index}
                  className={`rounded-full w-12 text-center relative transition-opacity ${hide && !isPlayed ? "opacity-0" : ""}`}
                  style={{
                    background: color,
                  }}
                  onMouseEnter={() => {
                    setTempNoteIndex(index);
                  }}
                  onMouseLeave={() => {
                    setTempNoteIndex(null);
                  }}
                  onClick={() => {
                    setSelectedNoteIndex(
                      selectedNoteIndex !== index ? index : null,
                    );
                  }}
                >
                  {pitchClassLabel}
                  <div
                    className={`text-green-500 absolute text-4xl inset-0 flex justify-center items-center transition-opacity ${isPlayed ? "opacity-100" : "opacity-0"}`}
                  >
                    <CheckCircle size={36} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
