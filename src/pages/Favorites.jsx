import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { removeFavorite } from "../redux/slices/favSlice";
import { toast } from "react-toastify";
import "../styles/favorites.css";

const Favorites = () => {
  const favoriteItems = useSelector((state) => state.favorites.favoriteItems);
  const dispatch = useDispatch();

  const removeFromFavorites = (itemId) => {
    dispatch(removeFavorite(itemId));
    toast.info("Removed from favorites");
  };

  const addToCart = (item) => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.productName,
        price: item.price,
        imgUrl: item.imgUrl,
      })
    );
    toast.success("Product added successfully");
  };

  return (
    <div className="fav__wrapper">
      <h2>Favorites</h2>
      <div className="favorite-items">
        {favoriteItems.length === 0 ? (
          <p>No favorite items yet.</p>
        ) : (
          <ul>
            {favoriteItems.map((item) => (
              <li key={item.id}>
                <div className="img-wrapper">
                  <img src={item.imgUrl} alt={item.productName} />
                </div>
                <div className="item-details">
                  <h3>{item.productName}</h3>
                  <p>${item.price}</p>
                  <button
                    className="remove-button"
                    onClick={() => removeFromFavorites(item.id)}
                  >
                    Remove from Favorites
                  </button>
                  <button
                    className="cart-button"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Favorites;
