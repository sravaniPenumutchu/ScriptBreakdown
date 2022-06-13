import { configureStore } from '@reduxjs/toolkit';
import analysisReducer from './slice/analysisSlice';
import dictionaryReducer from './slice/dictionarySlice';
import environmentReducer from './slice/environmentSlice';
import extractTextPdfReducer from './slice/extractTextPdfSlice';

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
    dictionary: dictionaryReducer,
    environment: environmentReducer,
    extractTextPdf: extractTextPdfReducer,
  },
});
