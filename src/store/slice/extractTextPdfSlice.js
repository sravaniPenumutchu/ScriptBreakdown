import { createSlice } from '@reduxjs/toolkit';
import { getOptionJson, fetchApi } from '../../api/request';
import { ApiUrls } from '../../utils/constants';

// Slice
export const extractTextPdfSlice = createSlice({
  name: 'extractTextPdf',
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
export const { fetchStart, fetchFailure, fetchSuccess } = extractTextPdfSlice.actions;

// 外部からはこの関数を呼ぶ
export const fetchExtractTextPdf = (env, pdf) => async (dispatch) => {
  try {
    const option = getOptionJson({ pdf });
    const url = ApiUrls[env].extractTextPdf;
    dispatch(fetchStart());
    dispatch(fetchSuccess(await fetchApi(url, option)));
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

// Selectors
export const requestExtractTextPdfApi = ({ extractTextPdf }) => extractTextPdf;

// Reducer(must be default export)
export default extractTextPdfSlice.reducer;
