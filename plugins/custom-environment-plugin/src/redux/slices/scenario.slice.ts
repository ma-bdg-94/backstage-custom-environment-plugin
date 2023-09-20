import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { scenarioInstance } from '../instances';

interface ScenarioState {
  isLoading: boolean | null;
  scenarioList: any;
  scenarioData: any;
  error: any;
}

export const addScenario = createAsyncThunk(
  'scenario/add',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await scenarioInstance.post('/', data, {
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

export const getScenarioList = createAsyncThunk(
  'scenario/get_list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scenarioInstance.get(`/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getScenario = createAsyncThunk(
  'scenario/get',
  async (data: any, { rejectWithValue }) => {
    const { id } = data;
    try {
      const response = await scenarioInstance.get(`/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  isLoading: null,
  error: null,
  scenarioData: null,
  scenarioList: [],
};

const scenarioPending = (state: ScenarioState) => {
  state.isLoading = true;
};

const scenarioError = (state: ScenarioState, action: any) => {
  state.error = action.payload;
};

export const scenarioSlice = createSlice({
  name: 'scenario',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addScenario.pending, scenarioPending)
      .addCase(getScenarioList.pending, scenarioPending)
      .addCase(getScenario.pending, scenarioPending)
      .addCase(addScenario.rejected, scenarioError)
      .addCase(getScenarioList.rejected, scenarioError)
      .addCase(getScenario.rejected, scenarioError)
      .addCase(addScenario.fulfilled, (state: ScenarioState, { payload }) => {
        state.scenarioList = [...state.scenarioList, payload];
      })
      .addCase(
        getScenarioList.fulfilled,
        (state: ScenarioState, { payload }) => {
          state.scenarioList = payload;
        },
      )
      .addCase(getScenario.fulfilled, (state: ScenarioState, { payload }) => {
        state.scenarioData = payload;
      });
  },
});

export const {} = scenarioSlice.actions;

export default scenarioSlice.reducer;
