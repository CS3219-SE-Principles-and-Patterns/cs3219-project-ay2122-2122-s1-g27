import { createTheme } from '@mui/material/styles';
import { BACKGROUND_COLOR } from './StylingConstants';

const theme = createTheme({
  typography: {
    fontFamily: '"Source Sans Pro", sans-serif;'
  },
  palette: {
    mode: 'dark',
    background: {
      default: BACKGROUND_COLOR,
      paper: BACKGROUND_COLOR
    }
  }
});

export default theme;
