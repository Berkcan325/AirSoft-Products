import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import favSlice from "./slices/favSlice";

const store = configureStore({
  reducer: {
    cart: cartSlice,
    favorites: favSlice,
  },
});

export default store;
