/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'resolute-border-light': "#E5E5E5",
        'resolute-bg': "#eeeeee",
        'resolute-text': "#150504",
        'resolute-primary': "#ffd36b",
        'resolute-secondary': "#212731",
        'resolute-accent': "#ffd36b"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    darkTheme: "light",
  }
}

