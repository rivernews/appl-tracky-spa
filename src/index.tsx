import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

/** redux */
import { Provider } from "react-redux";
import { Store, createStore, applyMiddleware } from "redux";
/** root store */
import { IRootState } from "./store/types";
import { RootReducer } from "./store/reducers";

/** sagas */
import createSagaMiddleware from 'redux-saga';
import { authSaga } from "./sagas/auth/sagas";

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

/** setup saga */
const sagaMiddleware = createSagaMiddleware();

/** generate the singleton store from redux */
const store = createStore<IRootState, any, any, any>(
    RootReducer,
    applyMiddleware(sagaMiddleware)
);

/** run saga */
sagaMiddleware.run(
    // add saga here
    authSaga
)

ReactDOM.render(<Root store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
