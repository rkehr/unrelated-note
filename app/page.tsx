import RandomNotes from "@/components/RandomNotes";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background text-foreground flex w-screen">
      <main className="w-full h-full flex flex-col">
        <RandomNotes />

        <div className="opacity-50 flex justify-around m-4">
          <Link href="imprint">imprint</Link>
          <Link href="support">support</Link>
          <Link href="https://robinkehr.de/">@akaz</Link>
          <Link href="explore">fretboard explorer</Link>
        </div>
      </main>
    </div>
  );
}
