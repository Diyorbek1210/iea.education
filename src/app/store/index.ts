import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import authReducer from "./slices/authSlice";
import settingsReducer from "./slices/settingsSlice";
import notificationsReducer from "./slices/notificationsSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      settings: settingsReducer,
      notifications: notificationsReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

let singletonStore: AppStore | undefined;

export function getStore(): AppStore {
  if (!singletonStore) {
    singletonStore = makeStore();
  }
  return singletonStore;
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { getStore as store };
