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
            fontFamily: {
                "press-start": ["var(--font-press-start)", "cursive"],
                "vt323": ["var(--font-vt323)", "monospace"],
                "fredoka": ["var(--font-fredoka)", "sans-serif"],
                "space-grotesk": ["var(--font-space-grotesk)", "sans-serif"],
                "sans": ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
                "heading": ["var(--font-fredoka)", "sans-serif"],
            },
        },
    },
    plugins: [],
} satisfies Config;