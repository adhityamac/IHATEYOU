import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import { GradientThemeProvider } from "@/components/shared/GradientThemeProvider";
import { CursorProvider } from "@/components/shared/CursorContext";
import { SoundProvider } from "@/components/shared/SoundProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import CustomCursor from "@/components/shared/CustomCursor";
import { CommandMenu } from "@/components/shared/CommandMenu";

export const metadata: Metadata = {
  title: "IHATEYOU - Neural Resonance",
  description: "A premium manifest interface for spectral communication.",
};

// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-[#000000] text-zinc-400 antialiased font-sans"
        suppressHydrationWarning
      >
        <GradientThemeProvider>
          <AuthProvider>
            <CommandMenu />
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
