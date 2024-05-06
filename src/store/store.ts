import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import userSlice from "./services/userSlice";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// combining Reducers making it ready to use it with persists
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  user: userSlice,
});

// conf
const persistConfig = {
  key: "root",
  storage,
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

// I could've use thunk here for serializable Data but I keep it simple :) 
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});


export const persistor = persistStore(store);
