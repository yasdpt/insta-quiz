/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tgBackground: "var(--tg-theme-bg-color)",
        tgText: "var(--tg-theme-text-color)",
        tgHint: "var(--tg-theme-hint-color)",
        tgLink: "var(--tg-theme-link-color)",
        tgButton: "var(--tg-theme-button-color)",
        tgButtonText: "var(--tg-theme-button-text-color)",
        tgSecondaryBackground: "var(--tg-theme-secondary-bg-color)",
      },
    },
  },
  plugins: [],
};
