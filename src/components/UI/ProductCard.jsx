import { motion } from "framer-motion";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/product-card.css";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { addFavorite, removeFavorite } from "../../redux/slices/favSlice";
import { toast } from "react-toastify";

const categoryMapping = {
  smg: "SMG",
  ar: "Assault Rifle",
  sniper: "Sniper",
  shotgun: "Shotgun",
  pistol: "Pistol",
  helmet: "Helmet",
  mask: "Mask",
  gloves: "Gloves",
  vest: "Vest",
  goggles: "Goggles",
  shoes: "Shoes",
  top: "Top",
  bottom: "Bottom",
  scope: "Scope",
  stand: "Stand",
  stock: "Stock",
  magazine: "Magazine",
  laser: "Laser",
  silencer: "Silencer",
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const favorites = useSelector((state) => state.favorites.favoriteItems);
  const isFavorite = favorites.some((favorite) => favorite.id === product.id);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const isOutOfStock =
    cartItem && cartItem.quantity >= product.availableQuantity;

  const addToCart = () => {
    if (isOutOfStock) {
      toast.warn("Cannot add more items, stock limit reached.");
      return;
    }
    dispatch(
      cartActions.addItem({
        id: product.id,
        productName: product.productName,
        price: product.price,
        imgUrl: product.imgUrls[0],
        quantity: 1,
        availableQuantity: product.availableQuantity,
      })
    );
    toast.success("Product added successfully");
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(product.id));
      toast.info("Removed from favorites");
    } else {
      dispatch(
        addFavorite({
          id: product.id,
          productName: product.productName,
          price: product.price,
          imgUrl: product.imgUrls[0],
        })
      );
      toast.success("Added to favorites");
    }
  };

  return (
    <Col lg="3" md="4" className="mb-2">
      <div className="product__item">
        <Link to={`/shop/${product.id}`}>
          <div className="product__img">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={product.imgUrls[0]}
              alt=""
            />
          </div>
        </Link>
        <div className="p-2 product__info">
          <h3 className="product__name">
            <Link to={`/shop/${product.id}`}>{product.productName}</Link>
          </h3>
          <span>{categoryMapping[product.category]}</span>
        </div>
        <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
          <span className="price">${product.price}</span>
          <motion.span
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1.3 }}
            onClick={toggleFavorite}
            className="icon"
          >
            <i className={isFavorite ? "ri-heart-fill" : "ri-heart-line"}></i>
          </motion.span>
          <motion.span
            whileHover={{ scale: !isOutOfStock ? 1.2 : 1 }}
            whileTap={{ scale: !isOutOfStock ? 1.3 : 1 }}
            onClick={addToCart}
            style={{
              color: isOutOfStock ? "grey" : "black",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
            }}
          >
            <i className="ri-add-line"></i>
          </motion.span>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
