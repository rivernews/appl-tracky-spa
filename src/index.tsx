import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

/** redux */
import { Provider } from "react-redux";
import { Store, createStore } from "redux";
/** root store */
import { IRootState } from "./store/types";
import { RootReducer } from "./store/reducers";

/** types */
interface IRootProps {
    store: Store<IRootState>
}

/** root component - just to wrap the App into redux store */
const Root: React.SFC<IRootProps> = (props) => {
    return (
        <Provider store={props.store}>
            <App />
        </Provider>
    );
};

/** generate the singleton store from redux */
const store = createStore<IRootState, any, any, any>(RootReducer);

ReactDOM.render(<Root store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
