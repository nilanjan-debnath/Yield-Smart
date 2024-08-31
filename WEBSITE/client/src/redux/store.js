import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import conversationReducer from './conversationId/conversationSlice';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

const rootReducer = combineReducers({ user: userReducer, conversation: conversationReducer});

const persistConfig = {
  key: 'root',
  storage: sessionStorage, // Use sessionStorage instead of localStorage
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);