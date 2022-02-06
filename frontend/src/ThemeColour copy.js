import { createTheme } from '@mui/material/styles';
import EuroStyleNormal from './fonts/EuroStyleNormal.woff2';

const ThemeColour = () => {
  const theme = createTheme({
    // text: {
    //   main: '#000',
    //   secondary: '#ff05f7'
    // },
    typography: {
      fontFamily: [
        'EuroStyle',
        'Arial',
        'calibri',
        'EuroStyle',
        'courier-new',
        'times-new-roman',
      ].join(','),
      components: {
        MuiCssBaseline: {
          styleOverrides: `
            @font-face {
              font-family: 'EuroStyle';
              font-style: normal;
              font-display: swap;
              font-weight: 400;
              src: local('EuroStyle'), local('EuroStyle-Regular'), url(${EuroStyleNormal}) format('woff2');
              unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }
          `,
        },
      },
    },
    palette: {
      darkblue: {
        main: '#062241',
        contrastText: '#fff',
      },
      medblue: {
        main: '#173C5E',
        contrastText: '#fff',
      },
      lightblue: {
        main: '#5C7FA1',
        contrastText: '#fff',
      },
      grey: {
        main: '#D1DEEC',
        contrastText: '#173C5E',
      },
      yellow: {
        main: '#edd071',
        contrastText: '#173C5E',
      },
      warning: {
        main: '#ff1744',
        contrastText: '#fff',
      },
      primaryButton: {
        main: '#072d57',
        contrastText: '#fff',
      },
      secondaryButton: {
        main: '#edd071',
        contrastText: '#173C5E',
      },
      lightBackground: {
        main: '#f5fafe',
        contrastText: '#173C5E',
      },
      darkbackground: {
        main: '#062241',
        contrastText: '#fff',
      },
      icon: {
        main: '#ffffff',
        contrastText: '#173C5E',
      },
      iconDisabled: {
        main: '#414b5e',
        contrastText: '#173C5E',
      },
      text: {
        main: '#000',
        heading: '#062241',
        heading2: '#173C5E',
        secondary: '#5C7FA1',
      },
      tonalOffset: 0.2,
    },
  });
  return (theme);
}

export default ThemeColour;
