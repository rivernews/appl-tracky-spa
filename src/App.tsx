/** React core */
import React, { Component, Dispatch } from "react";

/** Redux */
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { IRootState } from "./state-management/types/root-types";
import { RequestedLoginAuth } from "./state-management/action-creators/auth-actions";
import { RequestedLoginMode } from "./state-management/types/auth-types";

/** Routes & pages */
import { PageRoutesContainer } from "./pages/page-routes/page-routes";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";

/** Locals */
import "./App.css";
import "./ckeditor.css";
import { lightTheme } from "./components/themes";


interface IAppProps {
    retrieveLoginAuth: () => void;
}

class App extends Component<IAppProps> {
    componentDidMount() {
        this.props.retrieveLoginAuth();
    }

    render() {
        return (
            <div className="App">
                <CssBaseline />
                <MuiThemeProvider theme={lightTheme}>
                    <PageRoutesContainer />
                </MuiThemeProvider>
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => { 
    return {
        retrieveLoginAuth: () => {
            dispatch(
                RequestedLoginAuth(RequestedLoginMode.PREFILL)
            );
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
