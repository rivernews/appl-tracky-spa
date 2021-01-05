import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import pink from "@material-ui/core/colors/pink";

export const lightTheme = createMuiTheme({
    palette: {
        primary: {
            main: purple[800]
        },
        secondary: {
            main: pink[500]
        }
    }
});

export const darkTheme = createMuiTheme({
    palette: {
        type: 'dark'
    }
});