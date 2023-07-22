import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      height: {
        'input-md': 24,
      },
      colors: {
        mainbg: colors.slate[900],
        secondarybg: colors.slate[700],
        primary: colors.amber[400],
        'primary-darker': colors.amber[600],
        'primary-lighter': colors.amber[300],

        secondary: colors.slate[400],
        'secondary-darker': colors.slate[600],
        'secondary-lighter': colors.slate[300],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
