import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A1A1A',
          dark: '#000000',
          light: '#333333',
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          500: '#1A1A1A',
          600: '#111111',
          700: '#000000',
        },
        gold: {
          DEFAULT: '#B8860B',
          light: '#D4A843',
          dark: '#8B6508',
          50: '#FBF7EE',
          100: '#F5ECDA',
        },
        brand: {
          DEFAULT: '#006838',
          light: '#1F8A54',
          dark: '#004A27',
          50: '#E6F0EB',
          100: '#CCE1D7',
        },
        background: '#FFFFFF',
        surface: '#FFFFFF',
        'surface-warm': '#F9F7F4',
        border: '#E8E5E0',
        'text-primary': '#1A1A1A',
        'text-muted': '#7A7A7A',
        'venue-north': '#2563EB',
        'venue-south': '#DC2626',
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'sans-serif'],
      },
      letterSpacing: {
        'extra-wide': '0.2em',
      },
    },
  },
  plugins: [],
};
export default config;
