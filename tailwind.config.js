// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./App.tsx",
//     //"./creens/*.{js,jsx,ts,tsx}",
//     //"./**/*.{js,jsx,ts,tsx}"
//   ],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {
//       colors: {
//         // Use your preferred name and color
//         main: "#023047",
//       }
//     },
//   },
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./creens/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}