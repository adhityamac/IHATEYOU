import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            spacing: {
                'xs': '0.25rem', // 4px
                'sm': '0.5rem',  // 8px
                'md': '1rem',    // 16px
                'lg': '1.5rem',  // 24px
                'xl': '2rem',    // 32px
                '2xl': '3rem',   // 48px
                '3xl': '4.5rem', // 72px
                '4xl': '6rem',   // 96px
                '5xl': '9rem',   // 144px
                '6xl': '12rem',  // 192px
            },
            fontFamily: {
                "press-start": ["var(--font-press-start)", "cursive"],
                "vt323": ["var(--font-vt323)", "monospace"],
                "fredoka": ["var(--font-fredoka)", "sans-serif"],
                "space-grotesk": ["var(--font-space-grotesk)", "sans-serif"],
                "cormorant": ["var(--font-cormorant)", "serif"],
                "serif": ["var(--font-cormorant)", "serif"],
                "sans": ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
                "heading": ["var(--font-fredoka)", "sans-serif"],
                "heading-elegant": ["var(--font-cormorant)", "serif"],
            },
        },
    },
    plugins: [],
} satisfies Config;