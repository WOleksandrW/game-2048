import { combineReducers, configureStore } from '@reduxjs/toolkit';

import boardSlice from './boardSlice';

const rootReducer = combineReducers({
  boardSlice
});

export const setupStore = (preloadedState?: RootState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
