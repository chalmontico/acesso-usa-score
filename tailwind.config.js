/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#060810',
        'brand-dark': '#0D0F18',
        'brand-surface': '#111420',
        'brand-blue': '#1E6FFF',
        'brand-blue-light': '#3FA9F5',
        'brand-blue-dark': '#0A3D91',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
