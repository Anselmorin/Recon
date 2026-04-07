import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recon",
  description: "Scout your tasks before you commit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
