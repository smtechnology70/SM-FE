import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { enableBatching } from "redux-batched-actions";
import createSagaMiddleware from "redux-saga";

import { reducers } from "./reducers";
import sagas from "./sagas";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
      })
    : compose;

export const prepareStore = () => {
  const allReducers = enableBatching(
    combineReducers({
      ...reducers,
    })
  );

  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];

  const enhancer = composeEnhancers(applyMiddleware(...middleware));

  const store = createStore(allReducers, undefined, enhancer);

  sagaMiddleware.run(sagas);

  return store;
};

export const store = prepareStore();

export const dispatch = store.dispatch;
