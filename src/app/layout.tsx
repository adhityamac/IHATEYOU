import type { Metadata } from "next";
import "./globals.css";
import { GradientThemeProvider } from "@/components/shared/GradientThemeProvider";
import { CursorProvider } from "@/components/shared/CursorContext";
import { SoundProvider } from "@/components/shared/SoundProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import CustomCursor from "@/components/shared/CustomCursor";

export const metadata: Metadata = {
  title: "IHATEYOU - Neural Resonance",
  description: "A premium manifest interface for spectral communication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="text-base">
      <body
        className="bg-[#000000] text-zinc-400 antialiased font-sans"
      >
        <GradientThemeProvider>
          <AuthProvider>
            <CursorProvider>
              <SoundProvider>
                <CustomCursor />
                <main className="relative z-10">{children}</main>
              </SoundProvider>
            </CursorProvider>
          </AuthProvider>
        </GradientThemeProvider>
      </body>
    </html>
  );
}
