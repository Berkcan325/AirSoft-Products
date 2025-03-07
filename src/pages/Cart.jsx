import React from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <Helmet title="Cart">
      <CommonSection title="Shopping Cart" />
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">No items added to the cart</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <Tr item={item} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
            <Col lg="3">
              <div>
                <h6 className="d-flex align-items-center justify-content-between">
                  Subtotal:
                  <span className="fs-4 fw-bold">${totalAmount}</span>
                </h6>
              </div>
              <p className="fs-6 mt-2">
                taxes and shipping fees will get calculated in checkout
              </p>
              <div>
                <Link
                  to="/checkout"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn d-flex w-100"
                  >
                    Checkout
                  </motion.button>
                </Link>
                <Link
                  to="/shop"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn d-flex w-100 mt-3"
                  >
                    Continue Shopping
                  </motion.button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = ({ item }) => {
  const dispatch = useDispatch();

  const increment = () => {
    dispatch(cartActions.incrementQuantity(item.id));
  };

  const decrement = () => {
    dispatch(cartActions.decrementQuantity(item.id));
  };

  const deleteProduct = () => {
    dispatch(cartActions.deleteItem(item.id));
  };

  return (
    <tr>
      <td>
        <img src={item.imgUrl} alt="" />
      </td>
      <td className="">{item.productName}</td>
      <td>${item.price}</td>
      <td>
        <div className="quantity-control">
          <button onClick={decrement} disabled={item.quantity <= 1}>
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={increment}
            disabled={item.quantity >= item.availableQuantity}
          >
            +
          </button>
        </div>
      </td>
      <td>
        <motion.button
          onClick={deleteProduct}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 1.4 }}
          className="buy__btn mt-0"
        >
          Remove
        </motion.button>
      </td>
    </tr>
  );
};

export default Cart;
