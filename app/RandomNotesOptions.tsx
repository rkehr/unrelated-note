import { accidentalUnicode } from "@/components/PitchLabel";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SetStateAction, Dispatch } from "react";

interface RandomNotesOptionsProps {
  options: RandomNotesOptions;
  setOptions: Dispatch<SetStateAction<RandomNotesOptions>>;
}

export default function RandomNotesOptions(props: RandomNotesOptionsProps) {
  const { options } = props;
  const setOptions = (newOptions: Partial<RandomNotesOptions>) => {
    props.setOptions({ ...options, ...newOptions });
  };
  const { isStrict, preferFlats, viewMode } = options;
  return (
    <Collapsible className="w-full max-w-lg mt-4 mx-4">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full">
          options
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex justify-between gap-4 w-full p-8">
          <Button
            className=""
            onClick={() =>
              setOptions({ viewMode: (viewMode + 1) % viewModes.length })
            }
          >
            view: {viewModes[viewMode]}
          </Button>
          <Button
            className=""
            onClick={() => setOptions({ isStrict: !isStrict })}
          >
            pitch detection: {isStrict ? "strict" : "lenient"}
          </Button>
          <Button
            className=""
            onClick={() => setOptions({ preferFlats: !preferFlats })}
          >
            prefer: {accidentalUnicode[preferFlats ? "b" : "#"]}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export interface RandomNotesOptions {
  viewMode: number;
  isStrict: boolean;
  preferFlats: boolean;
}
export const viewModes = ["both", "stave"];
