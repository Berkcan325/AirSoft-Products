import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/product-details.css";
import { motion } from "framer-motion";
import ProductsList from "../components/UI/ProductsList";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { addFavorite, removeFavorite } from "../redux/slices/favSlice";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import "@fortawesome/fontawesome-free/css/all.min.css";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";

const categoryMapping = {
  ar: "Assault Rifle",
  smg: "SMG",
  sniper: "Sniper",
  helmet: "Helmet",
  mask: "Mask",
  gloves: "Gloves",
  vest: "Vest",
  goggles: "Goggles",
  shoes: "Shoes",
  top: "Top",
  bottom: "Bottom",
  // Add more mappings as needed
};

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tab, setTab] = useState("desc");
  const reviewUser = useRef("");
  const reviewMsg = useRef("");
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { data: products } = useGetData("products");
  const docRef = doc(db, "products", id);

  const favoriteItems = useSelector((state) => state.favorites.favoriteItems);
  const isFavorite = favoriteItems.some((item) => item.id === id);

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.imgUrls.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.imgUrls.length) % product.imgUrls.length
    );
  };

  useEffect(() => {
    const getProduct = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log("No product found!");
      }
    };
    getProduct();

    const q = query(collection(docRef, "reviews"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsArr = [];
      querySnapshot.forEach((doc) => {
        reviewsArr.push(doc.data());
      });
      setReviews(reviewsArr);
    });

    return () => unsubscribe();
  }, [id]);

  const {
    imgUrls = [],
    productName,
    price,
    quantity: availableQuantity,
    rating: productRating = 0,
    numberOfRates = 0,
    description,
    category,
    manufacturer,
    color,
    fps,
    magazineCapacity,
    weight,
    material,
    size,
  } = product;

  const relatedProducts = products.filter((item) => item.category === category);

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewUserName = reviewUser.current.value;
    const reviewUserMsg = reviewMsg.current.value;

    if (rating === 0 || reviewUserName === "" || reviewUserMsg === "") {
      toast.error("Please fill all fields");
      return;
    }

    const reviewObj = {
      userName: reviewUserName,
      text: reviewUserMsg,
      rating,
      date: new Date(),
    };

    try {
      const newNumberOfRates = numberOfRates + 1;
      const newRating =
        (productRating * numberOfRates + rating) / newNumberOfRates;

      await updateDoc(docRef, {
        rating: newRating,
        numberOfRates: newNumberOfRates,
      });

      await addDoc(collection(docRef, "reviews"), reviewObj);

      setProduct((prevProduct) => ({
        ...prevProduct,
        rating: newRating,
        numberOfRates: newNumberOfRates,
      }));

      toast.success("Thank you for your review!");
    } catch (error) {
      toast.error("Failed to submit the review");
      console.error("Error updating document: ", error);
    }
  };

  const addToCart = () => {
    if (quantity > availableQuantity) {
      toast.error("Selected quantity exceeds available stock");
      return;
    }
    dispatch(
      cartActions.addItem({
        id,
        image: imgUrls[currentImageIndex],
        productName,
        price,
        quantity,
      })
    );
    toast.success("Product added successfully");
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(id));
      toast.success("Removed from favorites");
    } else {
      dispatch(
        addFavorite({
          id,
          productName,
          imgUrl: imgUrls[currentImageIndex],
          price,
        })
      );
      toast.success("Added to favorites");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 350);
  }, [product]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <i
            key={index}
            className="ri-star-fill"
            style={{ color: "coral" }}
          ></i>
        ))}
        {halfStar && (
          <i className="ri-star-half-fill" style={{ color: "coral" }}></i>
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <i
            key={index}
            className="ri-star-line"
            style={{ color: "coral" }}
          ></i>
        ))}
      </>
    );
  };

  const renderReviewStars = () => {
    return (
      <div className="form__group d-flex align-items-center gap-3 rating__group">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.span
            key={star}
            whileTap={{ scale: 1.4 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setRating(star)}
          >
            {star <= rating ? (
              <i className="ri-star-fill" style={{ color: "coral" }}></i>
            ) : (
              <i className="ri-star-line" style={{ color: "coral" }}></i>
            )}
          </motion.span>
        ))}
      </div>
    );
  };

  const renderAttributesByCategory = (category) => {
    switch (category) {
      default:
        return (
          <>
            <p>
              <strong>Manufacturer:</strong> {manufacturer}
            </p>
            <p>
              <strong>FPS:</strong> {fps}
            </p>
            <p>
              <strong>Color:</strong> {color}
            </p>
            <p>
              <strong>Material:</strong> {material}
            </p>
            <p>
              <strong>Magazine Capacity:</strong> {magazineCapacity}
            </p>
            <p>
              <strong>Weight[g]:</strong> {weight}
            </p>
          </>
        );
      case "helmet":
      case "mask":
      case "gloves":
      case "vest":
      case "goggles":
      case "scope":
      case "silencer":
      case "stand":
      case "magazine":
      case "stock":
      case "laser":
        return (
          <>
            <p>
              <strong>Manufacturer:</strong> {manufacturer}
            </p>
            <p>
              <strong>Material:</strong> {material}
            </p>
            <p>
              <strong>Color:</strong> {color}
            </p>
          </>
        );
      case "shoes":
      case "top":
      case "bottom":
        return (
          <>
            <p>
              <strong>Manufacturer:</strong> {manufacturer}
            </p>
            <p>
              <strong>Material:</strong> {material}
            </p>
            <p>
              <strong>Size:</strong> {size}
            </p>
            <p>
              <strong>Color:</strong> {color}
            </p>
          </>
        );
    }
  };

  return (
    <Helmet title={productName}>
      <CommonSection title={productName} />
      <section>
        <Container>
          <Row>
            <Col lg="6">
              {imgUrls.length > 0 && (
                <div className="product__image-container">
                  <img
                    src={imgUrls[currentImageIndex]}
                    alt={productName}
                    className="product__image"
                  />
                  <div className="image__navigation">
                    <button
                      className="img__btn prev__btn"
                      onClick={handlePrevImage}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      className="img__btn next__btn"
                      onClick={handleNextImage}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </Col>
            <Col lg="6">
              <div className="single__product__content">
                <h2>{productName}</h2>
                <div className="d-flex align-items-center gap-5 mb-3">
                  <div>{renderStars(productRating)}</div>
                  <p className="d-flex mt-3">
                    (<span>{productRating?.toFixed(1)}</span>) ratings
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="product__price">${price}</span>
                  <span>Category: {categoryMapping[category] || category}</span>
                </div>
                {renderAttributesByCategory(category)}
                <div className="quantity__selector">
                  <label htmlFor="quantity">
                    <p>
                      <strong>Quantity:</strong>
                    </p>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    min="1"
                    max={availableQuantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <span>Available: {availableQuantity}</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 1.2 }}
                    onClick={addToCart}
                    className="buy__btn"
                  >
                    Add to Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 1.2 }}
                    onClick={toggleFavorite}
                    className="buy__btn"
                  >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </motion.button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : "pe-auto"}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={`${
                    tab === "leaveReview" ? "active__tab" : "pe-auto"
                  }`}
                  onClick={() => setTab("leaveReview")}
                >
                  Leave a Review
                </h6>
                <h6
                  className={`${tab === "reviews" ? "active__tab" : "pe-auto"}`}
                  onClick={() => setTab("reviews")}
                >
                  Reviews
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p>{description}</p>
                </div>
              ) : tab === "leaveReview" ? (
                <div className="review__form mt-5">
                  <h4>Leave your experience</h4>
                  <form onSubmit={submitHandler}>
                    <div className="form__group">
                      <input
                        type="text"
                        placeholder="Enter name"
                        ref={reviewUser}
                      />
                    </div>
                    {renderReviewStars()}
                    <div className="form__group">
                      <textarea
                        ref={reviewMsg}
                        rows={4}
                        type="text"
                        placeholder="Review Message ..."
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 1.2 }}
                      className="buy__btn"
                    >
                      Submit
                    </motion.button>
                  </form>
                </div>
              ) : (
                <div className="product__review mt-5">
                  <div className="review__wrapper">
                    <ul>
                      {reviews.map((review, index) => (
                        <li key={index} className="mb-4">
                          <div className="review__header">
                            <h6>{review.userName}</h6>
                            <span>{renderStars(review.rating)}</span>
                            <span className="review__date">
                              {new Date(
                                review.date.toDate()
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <p>{review.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Col>
            <Col lg="12" className="mt-5">
              <h2 className="related__title">You might also like</h2>
            </Col>
            <ProductsList data={relatedProducts} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
