import { createSlice } from '@reduxjs/toolkit';
import { getOptionJson, getOptionPdf, fetchApi } from '../../api/request';
import { ApiUrls } from '../../utils/constants';

// Slice
export const analysisSlice = createSlice({
  name: 'analysis',
  // stateの初期値を設定
  initialState: { loading: false, error: null, items: null },
  reducers: {
    // 通信を開始した時に呼ぶ関数
    fetchStart(state, action) {
      state.loading = true;
      state.error = null;
    },
    // 通信が失敗した時に呼ぶ関数
    fetchFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // 通信が成功した時に呼ぶ関数
    fetchSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.items = action.payload;
    },
  },
});

// Actions
export const { fetchStart, fetchFailure, fetchSuccess } = analysisSlice.actions;

// 外部からはこの関数を呼ぶ
export const fetchAnalysis = (value, path, userId, env) => async (dispatch) => {
  try {
    const option = getOptionJson({ text: value, user_id: userId });
    dispatch(fetchStart());
    if (path.indexOf('objects') !== -1) {
      const url = ApiUrls[env].getObjects;
      dispatch(fetchSuccess(await fetchApi(url, option)));
    } else if (path.indexOf('actions') !== -1) {
      const url = ApiUrls[env].getActions;
      dispatch(fetchSuccess(await fetchApi(url, option)));
    } else {
      const url = ApiUrls[env].getObjects;
      dispatch(fetchSuccess(await fetchApi(url, option)));
    }
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

// Selectors
export const requestAnalysisApi = ({ analysis }) => analysis;

// Reducer(must be default export)
export default analysisSlice.reducer;
