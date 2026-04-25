/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
  			display: ['Inter', 'system-ui', 'sans-serif'],
  		},
  		fontSize: {
  			'lg': ['1.125rem', { lineHeight: '1.75rem' }],
  			'xl': ['1.25rem', { lineHeight: '1.75rem' }],
  			'2xl': ['1.5rem', { lineHeight: '2rem' }],
  			'5xl': ['3rem', { lineHeight: '1' }],
  			'6xl': ['3.75rem', { lineHeight: '1' }],
  		},
  		colors: {
  			background: '#0a0f2e', // Navy
  			foreground: '#ffffff',
  			primary: {
  				DEFAULT: '#ff1744', // Neon Red
  				foreground: '#ffffff'
  			},
  			accent: {
  				DEFAULT: '#00bfff', // Cyan Glow
  				foreground: '#0a0f2e'
  			},
  			secondary: {
  				DEFAULT: '#1e3a8a', // Deep Navy
  				foreground: '#ffffff'
  			},
  			border: '#1e3a8a',
  			input: '#1e3a8a',
  			ring: '#00bfff',
  			muted: {
  				DEFAULT: '#16204d',
  				foreground: '#94a3b8'
  			},
  			card: {
  				DEFAULT: 'rgba(30, 58, 138, 0.4)',
  				foreground: '#ffffff'
  			}
  		},
  		boxShadow: {
  			'neon-red': '0 0 15px rgba(255, 23, 68, 0.5), 0 0 30px rgba(255, 23, 68, 0.2)',
  			'neon-cyan': '0 0 15px rgba(0, 191, 255, 0.5), 0 0 30px rgba(0, 191, 255, 0.2)',
  			'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  		},
  		dropShadow: {
  			'neon-red': '0 0 10px rgba(255, 23, 68, 0.8)',
  			'neon-cyan': '0 0 10px rgba(0, 191, 255, 0.8)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		backgroundImage: {
  			'metallic-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #0a0f2e 50%, #ff1744 100%)',
  		},
      rotate: {
        '360': '360deg',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")]
}