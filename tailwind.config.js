/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/views/**/*.ejs",
    "./public/**/*.js",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
  ],
  darkMode: 'class',
}
