import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  totalAmount: JSON.parse(localStorage.getItem("totalAmount")) || 0,
  totalQuantity: JSON.parse(localStorage.getItem("totalQuantity")) || 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          productName: newItem.productName,
          imgUrl: newItem.imgUrl,
          price: newItem.price,
          quantity: newItem.quantity,
          availableQuantity: newItem.availableQuantity,
          totalPrice: newItem.price * newItem.quantity,
        });
      } else {
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice += newItem.price * newItem.quantity;
      }

      state.totalQuantity += newItem.quantity;
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.totalPrice,
        0
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
      localStorage.setItem(
        "totalQuantity",
        JSON.stringify(state.totalQuantity)
      );
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity -= existingItem.quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.totalPrice,
        0
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
      localStorage.setItem(
        "totalQuantity",
        JSON.stringify(state.totalQuantity)
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
      localStorage.removeItem("totalQuantity");
    },
    incrementQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      if (
        existingItem &&
        existingItem.quantity < existingItem.availableQuantity
      ) {
        existingItem.quantity++;
        existingItem.totalPrice += existingItem.price;
        state.totalQuantity++;
        state.totalAmount += existingItem.price;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
      localStorage.setItem(
        "totalQuantity",
        JSON.stringify(state.totalQuantity)
      );
    },
    decrementQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
      localStorage.setItem(
        "totalQuantity",
        JSON.stringify(state.totalQuantity)
      );
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
