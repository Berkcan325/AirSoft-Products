import React, { useState, useEffect } from "react";
import "../styles/home.css";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Clock from "../components/UI/Clock";

import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import Services from "../services/Services";
import ProductsList from "../components/UI/ProductsList";
import useGetData from "../custom-hooks/useGetData";
import limitedofferimg from "../assets/images/M-Lok/counterimg.jpg";

const Home = () => {
  const { data: products, loading } = useGetData("products");
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSalesProducts, setBestSalesProducts] = useState([]);
  const [newArrivalsProducts, setNewArrivals] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  const year = new Date().getFullYear();

  useEffect(() => {
    const filteredTrendingProducts = products.filter(
      (item) => item.category === "smg"
    );

    const filteredBestSalesProducts = products.filter(
      (item) => item.category === "ar"
    );

    const filteredNewArrivals = products.filter(
      (item) => item.category === "sniper"
    );

    const filteredPopularProducts = products.filter(
      (item) => item.category === "pistol"
    );

    setTrendingProducts(filteredTrendingProducts);
    setBestSalesProducts(filteredBestSalesProducts);
    setNewArrivals(filteredNewArrivals);
    setPopularProducts(filteredPopularProducts);
  }, [products]);

  return (
    <Helmet title={"Home"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <h2>Make Your Life More Interesting With Your New Hobby</h2>
                <p style={{ maxWidth: "500px" }}>
                  Welcome to FierceShooters, your ultimate destination for
                  high-quality airsoft products! Dive into our extensive
                  collection of top-tier airsoft guns, gear, and accessories
                  designed to elevate your shooting experience to the next
                  level. Whether you're a seasoned airsoft enthusiast or just
                  starting out, we have everything you need to dominate the
                  battlefield with style and precision. Explore our arsenal
                  today and gear up for unmatched excitement and adventure on
                  the field!
                </p>
                <Link to="/shop">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 1.3 }}
                    className="buy__btn"
                  >
                    SHOP NOW
                  </motion.button>
                </Link>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="hero__img">
                {/* <img src={heroImg} alt="" /> */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Services />
      <section className="trending__products">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Trending Products</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading...</h5>
            ) : (
              <ProductsList data={trendingProducts} />
            )}
          </Row>
        </Container>
      </section>
      <section className="best__sales">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Best Sellers</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading...</h5>
            ) : (
              <ProductsList data={bestSalesProducts} />
            )}
          </Row>
        </Container>
      </section>
      <section className="timer__count">
        <Container>
          <Row>
            <Col lg="6" md="12" className="count__down-col">
              <div className="clock__top-content">
                <h4 className="text-white fs-6 mb-2">Limited Offer</h4>
                <h3 className="text-white fs-5 mb-3">Golden Eagle 6858</h3>
              </div>
              <Clock />
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.3 }}
                  className="buy__btn store__btn"
                >
                  Visit Store
                </motion.button>
              </Link>
            </Col>

            <Col lg="6" md="12" className="text-end counter__img">
              <img src={limitedofferimg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="new__arrivals">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title">New Arrivals</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading...</h5>
            ) : (
              <ProductsList data={newArrivalsProducts} />
            )}
          </Row>
        </Container>
      </section>
      <section className="popular__category">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title">Popular in Category</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading...</h5>
            ) : (
              <ProductsList data={popularProducts} />
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;
