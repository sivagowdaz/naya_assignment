import { configureStore } from "@reduxjs/toolkit";
import chessReducer from '../features/chess/chessSlice'

export const store = configureStore({
    reducer: chessReducer,
})