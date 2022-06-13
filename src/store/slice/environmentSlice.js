import { createSlice } from '@reduxjs/toolkit';

// Slice
export const environmentSlice = createSlice({
  name: 'env',
  // stateの初期値を設定
  initialState: { env: 'dev' },
  reducers: {
    setEnv(state, action) {
      state.env = action.payload;
      return state;
    },
  },
});

// Actions
export const { setEnv } = environmentSlice.actions;

// 外部からはこの関数を呼ぶ
export const fetchEnv = (env) => async (dispatch) => {
  dispatch(await setEnv(env));
};

// Selectors
export const selectorEnv = ({ env }) => env;

// Reducer(must be default export)
export default environmentSlice.reducer;
