import FretBoardViewer from "@/components/FretBoardViewer";
import RandomNotes from "@/components/RandomNotes";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background text-foreground flex w-screen min-h-screen">
      <main className="w-full h-full flex flex-col">
        <div className="text-xl font-bold text-center">on an</div>
        <h1 className="text-5xl font-bold text-center">unrelated note</h1>
        <div className="text-xl font-bold text-center">
          (an rng fretboard trainer)
        </div>

        <RandomNotes />

        <div className="opacity-50 flex justify-around m-4">
          <Link href="imprint">imprint</Link>
          <Link href="donate">donate</Link>
          <Link href="https://robinkehr.de/">@akaz</Link>
        </div>
      </main>
    </div>
  );
}
