import { createSlice } from '@reduxjs/toolkit';
import { getOptionJson, fetchApi } from '../../api/request';
import { ApiUrls } from '../../utils/constants';

// Slice
export const dictionarySlice = createSlice({
  name: 'dictionary',
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
export const { fetchStart, fetchFailure, fetchSuccess } = dictionarySlice.actions;

// 外部からはこの関数を呼ぶ
export const fetchDictionay = ({ param, apiType, env }) => async (dispatch) => {
  try {
    const option = getOptionJson(param);
    dispatch(fetchStart());
    switch (apiType) {
      case 'add':
        dispatch(fetchSuccess(await fetchApi(ApiUrls[env].addWordDictionary, option)));
        break;
      case 'delete':
        dispatch(fetchSuccess(await fetchApi(ApiUrls[env].omitWordDictionay, option)));
        break;
      case 'list':
        dispatch(fetchSuccess(await fetchApi(ApiUrls[env].getDictionaryList, option)));
        break;
      default:
    }
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

// Selectors
export const requestDictionaryApi = ({ dictionary }) => dictionary;

// Reducer(must be default export)
export default dictionarySlice.reducer;
