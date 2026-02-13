import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const edwin = localFont({
  src: [
    { path: "fonts/Edwin-Roman.otf", weight: "400", style: "normal" },
    { path: "fonts/Edwin-Italic.otf", weight: "400", style: "italic" },
    { path: "fonts/Edwin-Bold.otf", weight: "700", style: "normal" },
    { path: "fonts/Edwin-BdIta.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-edwin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "unrelated notes",
  description:
    "minimalist guitar, bass and mandolin fretboard layout training app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${edwin.variable} antialiased `}>
        <div className="flex flex-col w-screen min-h-screen">
          <div className="w-full flex flex-col">
            <div className="text-xl font-bold text-center">on an</div>
            <h1 className="text-5xl font-bold text-center">unrelated note</h1>
            <div className="text-xl font-bold text-center">
              (a fretboard trainer)
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
