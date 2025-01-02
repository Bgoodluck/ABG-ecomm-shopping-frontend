// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// const colors = require('tailwindcss/colors')

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     boxShadow: {
//       sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
//       DEFAULT:
//         "0 1px 3px 0 rgba(0, 0, 0, 0.1), o 1px 2px 0 rgba(0, 0, 0, 0.06)",
//       md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//       lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//       xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//       t: "0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
//       orange: "0px 20px 20px -15px rgba(245, 56, 56, 0.81)",
//       "green-md": "0px 20px 40px -15px rgba(13, 183, 96, 0.81)",
//     },
//     colors: {
//       themes: {
//         green: {
//           main: "#26c6da"
//         },
//         red: {
//           main: "#ff4444"
//         },
//         blue: {
//           main: "#2196f3"
//         }
//       },
//       transparent: "transparent",
//       background: 'hsl(var(--background))',
//       foreground: 'hsl(var(--foreground))',
//       first: 'hsl(271, 76%, 53%)',
//       title: 'hsl(0, 0%, 40%)',
//       text: 'hsl(0, 0%, 50%)',
//       body: 'hsl(0, 0%, 100%)',
//       container: 'hsl(0, 0%, 93%)',
//       border: 'hsl(var(--border))',
//       'text-white': '#fff',
//       'dark-title': 'hsl(0, 0%, 100%)',
//       'dark-text': 'hsl(0, 0%, 80%)',
//       'dark-body': 'hsl(0, 0%, 7%)',
//       'dark-container': 'hsl(0, 1%, 17%)',
//       'dark-border': 'hsl(0, 0%, 15%)',
//       card: {
//         DEFAULT: 'hsl(var(--card))',
//         foreground: 'hsl(var(--card-foreground))'
//       },
//       popover: {
//         DEFAULT: 'hsl(var(--popover))',
//         foreground: 'hsl(var(--popover-foreground))'
//       },
//       primary: {
//         DEFAULT: 'hsl(var(--primary))',
//         foreground: 'hsl(var(--primary-foreground))'
//       },
//       secondary: {
//         DEFAULT: 'hsl(var(--secondary))',
//         foreground: 'hsl(var(--secondary-foreground))'
//       },
//       muted: {
//         DEFAULT: 'hsl(var(--muted))',
//         foreground: 'hsl(var(--muted-foreground))'
//       },
//       accent: {
//         DEFAULT: 'hsl(var(--accent))',
//         foreground: 'hsl(var(--accent-foreground))'
//       },
//       destructive: {
//         DEFAULT: 'hsl(var(--destructive))',
//         foreground: 'hsl(var(--destructive-foreground))'
//       },
//       input: 'hsl(var(--input))',
//       ring: 'hsl(var(--ring))',
//       chart: {
//         '1': 'hsl(var(--chart-1))',
//         '2': 'hsl(var(--chart-2))',
//         '3': 'hsl(var(--chart-3))',
//         '4': 'hsl(var(--chart-4))',
//         '5': 'hsl(var(--chart-5))'
//       },
//       black: {
//         900: "#000000",
//         500: "#4F5665",
//         600: "#0B132A"
//       },
//       orange: {
//         100: "#FFECEC",
//         500: "#F53855"
//       },
//       green: {
//         500: "#2FAB73",
//         main: "#26c6da"
//       },
//       white: {
//         300: "#F8F8F8",
//         500: "#fff",
//       },
//       gray: {
//         100: "#EEEFF2",
//         400: "#AFB5C0",
//         500: "#DDDDDD"
//       },
//     },
//     extend: {
//       fontFamily: {
//         body: ['Open Sans', 'sans-serif'],
//         second: ['Poppins', 'sans-serif']
//       },
//       fontSize: {
//         big: '56px',
//         h1: '50px',
//         h2: '32px',
//         h3: '24px',
//         large: '18px',
//         normal: '16px',
//         small: '15px',
//         smaller: '14px',
//         tiny: '12px'
//       },
//       fontWeight: {
//         '400': '400',
//         '500': '500',
//         '600': '600',
//         '700': '700',
//         '800': '800'
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)'
//       }
//     },
//     variants: {
//       extend: {
//         Box: ["active", "hover"],
//       },
//     },
//   },
//   darkMode: ['class'],
//   plugins: [
//     require("tailwindcss-animate")
//   ],
// }
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    boxShadow: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), o 1px 2px 0 rgba(0, 0, 0, 0.06)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      t: "0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      orange: "0px 20px 20px -15px rgba(245, 56, 56, 0.81)",
      "green-md": "0px 20px 40px -15px rgba(13, 183, 96, 0.81)",
    },
    extend: {
      colors: {
        ...colors,
        themes: {
          green: {
            main: "#26c6da"
          },
          red: {
            main: "#ff4444"
          },
          blue: {
            main: "#2196f3"
          }
        },
        transparent: "transparent",
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        first: 'hsl(271, 76%, 53%)',
        title: 'hsl(0, 0%, 40%)',
        text: 'hsl(0, 0%, 50%)',
        body: 'hsl(0, 0%, 100%)',
        container: 'hsl(0, 0%, 93%)',
        border: 'hsl(var(--border))',
        'text-white': '#fff',
        'dark-title': 'hsl(0, 0%, 100%)',
        'dark-text': 'hsl(0, 0%, 80%)',
        'dark-body': 'hsl(0, 0%, 7%)',
        'dark-container': 'hsl(0, 1%, 17%)',
        'dark-border': 'hsl(0, 0%, 15%)',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        black: {
          900: "#000000",
          500: "#4F5665",
          600: "#0B132A"
        },
        orange: {
          100: "#FFECEC",
          500: "#F53855"
        },
        green: {
          500: "#2FAB73",
          main: "#26c6da"
        },
        white: {
          300: "#F8F8F8",
          500: "#fff",
        },
        gray: {
          100: "#EEEFF2",
          400: "#AFB5C0",
          500: "#DDDDDD"
        },
      },
      fontFamily: {
        body: ['Roboto', 'system-ui', 'sans-serif'],
        second: ['Roboto', 'system-ui', 'sans-serif']
      },
      fontSize: {
        big: '56px',
        h1: '50px',
        h2: '32px',
        h3: '24px',
        large: '18px',
        normal: '16px',
        small: '15px',
        smaller: '14px',
        tiny: '12px'
      },
      fontWeight: {
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
        '800': '800'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    },
    variants: {
      extend: {
        Box: ["active", "hover"],
      },
    },
  },
  darkMode: ['class'],
  plugins: [
    require("tailwindcss-animate")
  ],
}