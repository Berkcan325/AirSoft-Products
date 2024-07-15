import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage if available
const persistedFavorites = localStorage.getItem("favorites");
const initialState = {
  favoriteItems: persistedFavorites ? JSON.parse(persistedFavorites) : [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.favoriteItems.find(
        (item) => item.id === newItem.id
      );
      if (!existingItem) {
        state.favoriteItems.push({
          id: newItem.id,
          productName: newItem.productName,
          imgUrl: newItem.imgUrl,
          price: newItem.price,
        });
        // Update localStorage
        localStorage.setItem("favorites", JSON.stringify(state.favoriteItems));
      }
    },
    removeFavorite: (state, action) => {
      const id = action.payload;
      state.favoriteItems = state.favoriteItems.filter(
        (item) => item.id !== id
      );
      // Update localStorage
      localStorage.setItem("favorites", JSON.stringify(state.favoriteItems));
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
