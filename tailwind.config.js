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
        'acesso-black': '#050608',
        'acesso-gray-100': '#e7e8ea',
        'acesso-gray-300': '#a6aab1',
        'acesso-gray-500': '#6c7079',
        'acesso-gray-700': '#3c3f45',
        'acesso-gray-900': '#1b1d20',
        'acesso-blue-900': '#0a3d91',
        'acesso-blue-600': '#1e6fff',
        'acesso-blue-400': '#3fa9f5',
        'acesso-cyan': '#35d0ff',
        'acesso-ice': '#e4f6ff',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
