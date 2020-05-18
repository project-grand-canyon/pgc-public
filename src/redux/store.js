import { createStore } from 'redux';
import rootReducer from './reducers';
import { loadCalls, saveCalls } from '../util/localStorage'

const localStorageCalls = loadCalls();

export const store = createStore(
    rootReducer,
    localStorageCalls
);

store.subscribe(() => {
    saveCalls({
      calls: store.getState().calls
    });
  });
