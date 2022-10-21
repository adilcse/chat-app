
import {applyMiddleware, combineReducers, createStore,} from 'redux';
import AppReducer from './reducer/AppReducer';
import { createLogger } from 'redux-logger';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const logger = createLogger({
  // ...options
});


// Middleware: Redux Persist Config
const persistConfig = {
  key: 'root',
  // Storage Method (React Local storage)
  storage,
  // storage: storage,

  // Whitelist (Save Specific Reducers)
  whitelist: ['AppReducer'],
  // Blacklist (Don't Save Specific Reducers)
};

// Middleware: Redux Persist Persisted Reducer

const rootReducer = combineReducers({
  AppReducer: AppReducer,
});



const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(logger));
// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {store, persistor};
