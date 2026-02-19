import { Cog } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Options, useOptions } from "@/hooks/useOptions";
import { Switch } from "./ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "./ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { stringSets } from "./FretBoard";

interface OptionPageProps {
  options?: boolean;
}

export function OptionPage(props: OptionPageProps) {
  const { options, setOptions } = useOptions();
  const { fretBoardLayout } = options;
  return (
    <div className="flex flex-wrap gap-8 justify-between">
      <div className="flex flex-col space-y-4 md:max-w-5/12">
        <h3 className="font-bold text-lg">practice</h3>
        <OptionSwitch
          name="hideNoteNames"
          label="hide note names"
          description={
            "hide the note names of unplayed notes in your excercise. best if you dont care too much about learning to read sheet music"
          }
          options={options}
          setOptions={setOptions}
        />
        <OptionSwitch
          name="showNextNoteLocation"
          label="show next note on fretboard"
          description="preview all the locations of the next note in your excercise on the fretboard. "
          options={options}
          setOptions={setOptions}
        />
        <OptionSwitch
          name="isStrict"
          label="strict note progression"
          description="resets your correctly played notes, in your current excercise whenever it detects a wrong note. works best in quiet environments. disable if it picks up too many false negatives"
          options={options}
          setOptions={setOptions}
        />
      </div>
      <div className="flex flex-col space-y-4 md:max-w-5/12">
        <h3 className="font-bold text-lg">fretboard view</h3>
        <FieldLabel htmlFor="fretBoardLayout">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>fretboard layout</FieldTitle>
              <FieldDescription>
                select your instrument/ tuning
              </FieldDescription>
            </FieldContent>
            <Select
              value={fretBoardLayout}
              onValueChange={(value) =>
                setOptions({
                  fretBoardLayout: value as keyof typeof stringSets,
                })
              }
            >
              <SelectTrigger id="fretBoardLayout" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(stringSets).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldLabel>
        <OptionSwitch
          name="pearlColorByDegree"
          label="pearl color shows degree"
          description="pearl color is selected by notes degree in the scale, instead of absolutely"
          options={options}
          setOptions={setOptions}
        />
      </div>
      <div className="flex flex-col space-y-4 md:max-w-5/12">
        <h3 className="font-bold text-lg">note generation</h3>

        <OptionSwitch
          name="preferFlats"
          label="prefer flats"
          description="when generating random notes, show accidentals as flats (♭) insetad of sharps (♯)"
          options={options}
          setOptions={setOptions}
        />
        <FieldLabel htmlFor="fretBoardLayout">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>number of notes</FieldTitle>
              <FieldDescription>
                number of notes to generate (4 notes per bar)
              </FieldDescription>
            </FieldContent>
            <Select
              value={options.numNotes + ""}
              onValueChange={(value) =>
                setOptions({
                  numNotes: parseInt(value),
                })
              }
            >
              <SelectTrigger id="numberOfNotes" className="w-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[4, 8, 12, 16, 20, 24].map((key) => (
                  <SelectItem key={key} value={key + ""}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldLabel>
      </div>
    </div>
  );
}

export default function OptionPageDialog() {
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="text-xl flex justify-center items-center cursor-pointer relative overflow-clip h-12 w-12 bg-background text-foreground border-3 border-foreground rounded-full transition-colors hover:text-background hover:bg-foreground "
      >
        <button>
          <Cog />
        </button>
      </DialogTrigger>
      <DialogContent className="md:max-w-4xl overflow-y-auto max-h-[calc(100vh-2rem)]">
        <DialogTitle className="text-2xl">options</DialogTitle>
        <OptionPage />
      </DialogContent>
    </Dialog>
  );
}

interface OptionSwitchProps {
  name: keyof Options;
  label: string;
  description: string;
  options: Options;
  setOptions: (changes: Partial<Options>) => void;
}
function OptionSwitch(props: OptionSwitchProps) {
  const { name, label, description, options, setOptions } = props;
  const value = options[name];

  if (typeof value !== "boolean") {
    console.warn(
      "using a switch to display a non-boolean option does not make any sense. please use another component",
    );
    return null;
  }

  return (
    <FieldLabel htmlFor={name}>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>{label}</FieldTitle>
          <FieldDescription>{description}</FieldDescription>
        </FieldContent>
        <Switch
          id={name}
          checked={value}
          onCheckedChange={(checked) => {
            setOptions({ [name]: checked });
          }}
        />
      </Field>
    </FieldLabel>
  );
}
