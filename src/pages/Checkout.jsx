import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { cartActions } from "../redux/slices/cartSlice";
import "../styles/checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [billingInfo, setBillingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmpty = Object.values(billingInfo).some(
      (value) => value.trim() === ""
    );
    if (isEmpty) {
      toast.error("Please fill in all fields.");
      return;
    }

    const order = {
      ...billingInfo,
      totalQuantity,
      totalAmount,
      cartItems,
      createdAt: new Date(),
    };

    // Log the order object to ensure all fields are populated
    console.log("Order object:", order);

    try {
      // Validate that none of the order properties are undefined
      for (const key in order) {
        if (order[key] === undefined) {
          throw new Error(`Order property ${key} is undefined`);
        }
      }

      const docRef = await addDoc(collection(db, "orders"), order);
      toast.success("Order placed successfully!");
      console.log("Document written with ID: ", docRef.id);

      for (const item of cartItems) {
        const productRef = doc(db, "products", item.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          const newQuantity = productData.quantity - item.quantity;

          if (newQuantity < 0) {
            toast.error(`Not enough stock for product: ${item.productName}.`);
            return;
          }

          await updateDoc(productRef, {
            quantity: newQuantity,
          });
        } else {
          toast.error(`Product not found: ${item.productName}.`);
          return;
        }
      }

      dispatch(cartActions.clearCart());
      setBillingInfo({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
      });
    } catch (error) {
      toast.error("Error placing order: " + error.message);
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <h6 className="mb-4 fw-bold">Billing Information</h6>
              <Form className="billing__form" onSubmit={handleSubmit}>
                <FormGroup className="form__group">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={billingInfo.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={billingInfo.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <input
                    type="number"
                    placeholder="Phone number"
                    name="phone"
                    value={billingInfo.phone}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <input
                    type="text"
                    placeholder="Street address"
                    name="address"
                    value={billingInfo.address}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <input
                    type="text"
                    placeholder="City"
                    name="city"
                    value={billingInfo.city}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <input
                    type="text"
                    placeholder="Postal Code"
                    name="postalCode"
                    value={billingInfo.postalCode}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <input
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={billingInfo.country}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1.1 }}
                  className="buy__btn w-100 mt-0"
                  type="submit"
                >
                  Place an order
                </motion.button>
              </Form>
            </Col>
            <Col lg="4">
              <div className="checkout__cart">
                <h6>
                  Total Quantity: <span>{totalQuantity} items</span>
                </h6>
                <h6>
                  Subtotal: <span>${totalAmount}</span>
                </h6>
                <h6>
                  <span>
                    Shipping: <br />
                    Free shipping
                  </span>
                  <span>$0</span>
                </h6>
                <h4>
                  Total Cost: <span>${totalAmount}</span>
                </h4>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
