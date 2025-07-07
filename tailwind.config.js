/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e0f2fe',
          100: '#b9e6fe',
          200: '#7cd4fd',
          300: '#36befa',
          400: '#0ca6eb',
          500: '#0284c7',
          600: '#036ba1',
          700: '#065986',
          800: '#0c4a6e',
          900: '#0c3e5c',
          950: '#082f49',
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        success: {
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          500: '#f97316',
          600: '#ea580c',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        },
        dark: {
          100: '#1e1e2a',
          200: '#18181f',
          300: '#131318',
          400: '#0d0d12',
          500: '#09090f',
        },
        light: {
          100: '#ffffff',
          200: '#f9fafb',
          300: '#f3f4f6',
          400: '#e5e7eb',
          500: '#d1d5db',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glitch': 'glitch 1s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 1.5s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(0)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(-100%)', opacity: 0 },
        },
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.primary.400), 0 0 20px theme(colors.primary.500)',
        'neon-strong': '0 0 10px theme(colors.primary.400), 0 0 30px theme(colors.primary.500), 0 0 50px theme(colors.primary.600)',
      },
    },
  },
  plugins: [],
};