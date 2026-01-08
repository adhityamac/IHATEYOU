import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import "./animations.css";
import "./colors.css";
import { GradientThemeProvider } from "@/components/shared/GradientThemeProvider";
import { ThemeModeProvider } from "@/contexts/ThemeModeContext";
import { CursorProvider } from "@/components/shared/CursorContext";
import { SoundProvider } from "@/components/shared/SoundProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import CustomCursor from "@/components/shared/CustomCursor";
import { CommandMenu } from "@/components/shared/CommandMenu";
import { Press_Start_2P, VT323, Rubik_Vinyl, Special_Elite, Fredoka, Space_Grotesk } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const rubikVinyl = Rubik_Vinyl({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rubik-vinyl",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
});

const fredoka = Fredoka({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "IHATEYOU - Neural Resonance",
  description: "A premium manifest interface for spectral communication.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'IHATEYOU',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${pressStart2P.variable} ${vt323.variable} ${rubikVinyl.variable} ${specialElite.variable} ${fredoka.variable} ${spaceGrotesk.variable} antialiased font-sans bg-theme-primary text-theme-primary transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeModeProvider>
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
        </ThemeModeProvider>
      </body>
    </html>
  );
}
