import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import scenarioSlice from './slices/scenario.slice';
import containerImageSlice from './slices/containerImage.slice';
import environmentSlice from './slices/environment.slice';

export const store: any = configureStore({
  reducer: {
    scenarios: scenarioSlice,
    containerImages: containerImageSlice,
    environments: environmentSlice
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
