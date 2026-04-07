import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Recon",
  description: "Scout your tasks before you commit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${comfortaa.className} bg-[#0f0f1a] text-white antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
