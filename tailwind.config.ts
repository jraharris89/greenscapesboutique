import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earth-tone palette for Greenscapes Boutique
        sage: {
          50: "#f6f7f4",
          100: "#e3e7de",
          200: "#c7d0bc",
          300: "#a4b293",
          400: "#839572",
          500: "#667a56",
          600: "#506143",
          700: "#404d37",
          800: "#353f2f",
          900: "#2d3529",
          950: "#161c13",
        },
        terracotta: {
          50: "#fdf6f3",
          100: "#fbeae4",
          200: "#f8d8cd",
          300: "#f2bca9",
          400: "#e9947a",
          500: "#dd7454",
          600: "#c95a3a",
          700: "#a8472e",
          800: "#8b3d2a",
          900: "#733728",
          950: "#3e1a11",
        },
        cream: {
          50: "#fdfcf9",
          100: "#f9f6ed",
          200: "#f3ecd8",
          300: "#e9ddb9",
          400: "#dcc890",
          500: "#d0b26d",
          600: "#c19a54",
          700: "#a17d46",
          800: "#83653e",
          900: "#6c5335",
          950: "#3a2b1b",
        },
        moss: {
          50: "#f3f6f3",
          100: "#e3e9e3",
          200: "#c8d4c8",
          300: "#a0b5a1",
          400: "#749076",
          500: "#547358",
          600: "#415c45",
          700: "#354a39",
          800: "#2c3c30",
          900: "#253228",
          950: "#131b15",
        },
        bark: {
          50: "#f8f6f4",
          100: "#eeebe6",
          200: "#ddd5cc",
          300: "#c7baab",
          400: "#b09a87",
          500: "#9f846d",
          600: "#927561",
          700: "#7a6052",
          800: "#645047",
          900: "#52433b",
          950: "#2b221e",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "leaf-pattern": "url('/images/patterns/leaf-pattern.svg')",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
