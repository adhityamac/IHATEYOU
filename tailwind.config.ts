import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            animation: {
                aurora: "aurora 20s linear infinite",
            },
            keyframes: {
                aurora: {
                    from: {
                        transform: "rotate(0deg)",
                    },
                    to: {
                        transform: "rotate(360deg)",
                    },
                },
            },
        },
    },
    plugins: [],
};

export default config;