import { createTheme } from '@mui/material/styles';

const ThemeColour = () => {
  const theme = createTheme({
    // text: {
    //   main: '#000',
    //   secondary: '#ff05f7'
    // },
    typography: {
      fontFamily: [
        'Arial',
        'calibri',
        'EuroStyle',
        'courier-new',
        'times-new-roman',
      ].join(','),
      h1: {
        fontFamily: '"Montserrat", "Arial"',
        color: '#062241'
      },
      h2: {
        fontFamily: '"courier", "Montserrat", "Arial"',
        color: '#062241'
      },
      h3: {
        fontFamily: '"courier", "Montserrat", "Arial"',
        color: '#062241'
      },
      h4: {
        fontFamily: '"courier", "Montserrat", "Arial"',
        color: '#062241'
      },
      h5: {
        fontFamily: '"courier", "Montserrat", "Arial"',
        color: '#062241'
      },
      h6: {
        fontFamily: '"courier", "Montserrat", "Arial"',
        color: '#062241'
      },
      h7: {
        fontFamily: '"courier", "Montserrat", "Arial"',
        color: '#062241'
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
