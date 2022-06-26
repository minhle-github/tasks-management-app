import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux';
import { baseApi } from "./api";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "../features/auth/authSlice";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  blacklist: [baseApi.reducerPath],
  stateReconciler: autoMergeLevel2
};

const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]:  baseApi.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
      .concat(baseApi.middleware),
  devTools: true
})

export const persitor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {}
export type AppDispatch = typeof store.dispatch;
