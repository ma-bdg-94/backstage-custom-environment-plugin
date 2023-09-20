import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { environmentInstance } from '../instances';

interface EnvironmentState {
  isLoading: boolean | null;
  environmentData: any;
  error: any;
  currentStep: any,
  loadingMessage: string | null,
}

export const createEnvironment = createAsyncThunk(
  'environment/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await environmentInstance.post('/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  isLoading: null,
  error: null,
  environmentData: null,
  currentStep: null,
  loadingMessage: null
};

const environmentPending = (state: EnvironmentState, action: any) => {
  state.isLoading = true;
  state.currentStep = action.meta.arg.step;
  state.loadingMessage = action.meta.arg.loadingMessage;
};

const environmentError = (state: EnvironmentState, action: any) => {
  state.error = action.payload;
};

export const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createEnvironment.pending, environmentPending)
      .addCase(createEnvironment.rejected, environmentError)
      .addCase(
        createEnvironment.fulfilled,
        (state: EnvironmentState, { payload }) => {
          state.environmentData = payload;
        },
      );
  },
});

export const {} = environmentSlice.actions;

export default environmentSlice.reducer;
