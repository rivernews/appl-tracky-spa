import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

/** redux */
import { Provider } from "react-redux";
import { Store } from "redux";
/** root store */
import { IRootState } from "./store/types";
import { store } from "./store/store-config";

/** router */
import { ConnectedRouter } from "connected-react-router";
import { history } from "./store/store-config";

/** types */
interface IRootProps {
    store: Store<IRootState>;
}

/** root component - just to wrap the App into redux store */
const Root: React.SFC<IRootProps> = props => {
    return (
        <Provider store={props.store}>
            <ConnectedRouter history={history} >
                <App />
            </ConnectedRouter>
        </Provider>
    );
};

ReactDOM.render(<Root store={store} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
