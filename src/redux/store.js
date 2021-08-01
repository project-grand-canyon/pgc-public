import { createStore } from 'redux';
import rootReducer from './reducers';
import { loadCallsAndNotifications, saveCalls, saveNotification } from '../util/localStorage'

const load = loadCallsAndNotifications();

export const store = createStore(
    rootReducer,
    load
);

store.subscribe(() => {
    console.log(store.getState())
    saveCalls(store.getState().calls);
    saveNotification(store.getState().notification)
  });
