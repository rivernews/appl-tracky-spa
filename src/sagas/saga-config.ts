import createSagaMiddleware from 'redux-saga';

import { rootSaga } from "./auth/sagas";

/** setup saga */
const sagaMiddleware = createSagaMiddleware();

export {
    sagaMiddleware
};

export const runSagaMiddleaware = () => {
    sagaMiddleware.run(rootSaga)
}