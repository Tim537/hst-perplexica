import type { Config } from 'tailwindcss';
import type { DefaultColors } from 'tailwindcss/types/generated/colors';

const themeDark = (colors: DefaultColors) => ({
  50: '#0a0a0a',
  100: '#111111',
  200: '#1c1c1c',
});

const themeLight = (colors: DefaultColors) => ({
  50: '#fcfcf9',
  100: '#f3f3ee',
  200: '#e8e8e3',
});

const themeHst = (colors: DefaultColors) => ({
  50: '#fcfcf9',
  100: '#f3f3ee',
  200: '#e8e8e3',
  accent: '#CA5116',
});

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: ({ theme }) => ({
        ...theme('colors'),
        'hst-accent': '#CA5116'
      }),
      colors: ({ colors }) => {
        const colorsDark = themeDark(colors);
        const colorsLight = themeLight(colors);
        const colorsHst = themeHst(colors);

        return {
          dark: {
            primary: colorsDark[50],
            secondary: colorsDark[100],
            ...colorsDark,
          },
          light: {
            primary: colorsLight[50],
            secondary: colorsLight[100],
            ...colorsLight,
          },
          hst: {
            primary: colorsHst[50],
            secondary: colorsHst[100],
            ...colorsHst,
          },
        };
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-slide-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-slide-in': 'fade-slide-in 0.7s ease-out forwards 0.2s',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    function({ addVariant }: { addVariant: (name: string, definition: string) => void }) {
      addVariant('hst', '.hst &');
    },
  ],
};
export default config;
