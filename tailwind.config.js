/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false, // Prevent Tailwind reset from conflicting with App.css
  },
  theme: {
    extend: {
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
