import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import { loadCalls, saveCalls } from '../util/localStorage'

const loggerMiddleware = createLogger();

const localStorageCalls = loadCalls();

export const store = createStore(
    rootReducer,
    localStorageCalls,
    applyMiddleware(
        loggerMiddleware
    )
);

store.subscribe(() => {
    console.log('persisting calls')
    saveCalls({
      calls: store.getState().calls
    });
  });
