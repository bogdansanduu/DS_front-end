import { configureStore } from "@reduxjs/toolkit";
import { AllReducers } from "./reducers";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, AllReducers);

const myStore = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: [thunk],
});

export const persistedStore = {
  store: myStore,
  persistor: persistStore(myStore),
};

export type AppDispatch = typeof myStore.dispatch;
