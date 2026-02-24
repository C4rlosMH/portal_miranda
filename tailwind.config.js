/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aquí podremos poner los colores oficiales de Miranda Net más adelante
        brand: {
          500: '#2563eb', // Un azul de ejemplo
          600: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}