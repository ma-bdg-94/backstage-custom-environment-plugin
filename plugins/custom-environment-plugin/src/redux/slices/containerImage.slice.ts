import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { containerImageInstance } from '../instances';

interface ContainerImageState {
  isLoading: boolean | null;
  imageList: any;
  containerImageData: any;
  error: any;
}

export const addImage = createAsyncThunk(
  'image/add',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await containerImageInstance.post('/', data, {
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

export const getImageList = createAsyncThunk(
  'image/get_list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await containerImageInstance.get(`/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getImageById = createAsyncThunk(
  'image/get',
  async (data: any, { rejectWithValue }) => {
    const { id } = data;
    try {
      const response = await containerImageInstance.get(`/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  isLoading: null,
  error: null,
  containerImageData: null,
  imageList: [],
} as ContainerImageState;

const imagePending = (state: ContainerImageState) => {
  state.isLoading = true;
};

const imageError = (state: ContainerImageState, action: any) => {
  state.error = action.payload;
};

export const containerImageSlice = createSlice({
  name: 'containerImage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addImage.pending, imagePending)
      .addCase(getImageList.pending, imagePending)
      .addCase(getImageById.pending, imagePending)
      .addCase(addImage.rejected, imageError)
      .addCase(getImageList.rejected, imageError)
      .addCase(getImageById.rejected, imageError)
      .addCase(
        addImage.fulfilled,
        (state: ContainerImageState, { payload }) => {
          state.imageList = [...state.imageList, payload];
        },
      )
      .addCase(
        getImageList.fulfilled,
        (state: ContainerImageState, { payload }) => {
          state.imageList = payload;
        },
      )
      .addCase(
        getImageById.fulfilled,
        (state: ContainerImageState, { payload }) => {
          state.containerImageData = payload;
        },
      );
  },
});

export const {} = containerImageSlice.actions;

export default containerImageSlice.reducer;
