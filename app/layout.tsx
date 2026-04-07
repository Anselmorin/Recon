import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({ subsets: ["latin"], weight: ["700"] });

export const metadata: Metadata = {
  title: "Recon",
  description: "Scout your tasks before you commit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${comfortaa.className} antialiased min-h-screen`} style={{ background: "linear-gradient(160deg, #fdf4ff 0%, #eff6ff 40%, #f0fdf4 100%)", color: "#1a1a2e" }}>
        {children}
      </body>
    </html>
  );
}
