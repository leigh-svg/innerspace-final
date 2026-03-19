/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-Fashion Minimalist Palette
        brand: {
          charcoal: {
            DEFAULT: '#121212',
            light: '#2A2A2A',
            dark: '#0A0A0A'
          },
          gold: {
            DEFAULT: '#C5A880',
            muted: '#A88D66',
            light: '#E6D5B8' // Champagne Gold
          },
          bone: {
            DEFAULT: '#F5F5F0',
            dark: '#E8E5DF' // For subtle contrast
          }
        }
      },
      fontFamily: {
        // High-contrast Serif for headers, geometric Sans for data/UI
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Premium, whispering shadows rather than harsh drops
        'premium': '0 4px 40px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
