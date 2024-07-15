import React from "react";
import "./footer.css";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="4" className="mb-4" md="6">
            <div className="logo">
              <div>
                <h1 className="text-white">FierceShooters</h1>
              </div>
            </div>
            <p className="footer__text mt-4">
              At FierceShooters, we're grateful for every shot you take and
              every moment you spend with us. Our passion for airsoft is matched
              only by our commitment to quality, safety, and exceptional
              customer service. Discover a wide range of premium airsoft
              products crafted for enthusiasts like you. Thank you for choosing
              FierceShooters, where excellence meets adventure on every
              battlefield.
            </p>
          </Col>
          <Col lg="3" md="3" className="mb-4">
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Top Categories</h4>
              <ListGroup>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="">Assault Rifle</Link>
                </ListGroupItem>

                <ListGroupItem className="ps-0 border-0">
                  <Link to="">Sniper</Link>
                </ListGroupItem>

                <ListGroupItem className="ps-0 border-0">
                  <Link to="">Pistol</Link>
                </ListGroupItem>

                <ListGroupItem className="ps-0 border-0">
                  <Link to="">Helmet</Link>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
          <Col lg="2" md="3" className="mb-4">
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Useful Links</h4>
              <ListGroup>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="/shop">Shop</Link>
                </ListGroupItem>

                <ListGroupItem className="ps-0 border-0">
                  <Link to="/cart">Cart</Link>
                </ListGroupItem>

                <ListGroupItem className="ps-0 border-0">
                  <Link to="#">Privacy Policy</Link>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
          <Col lg="3" md="4">
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Contact</h4>
              <ListGroup className="footer__contact">
                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span className="">
                    <i className="ri-map-pin-line d-flex mb-3"></i>
                  </span>
                  <p>Silistra 4, Varna</p>
                </ListGroupItem>

                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-phone-line d-flex mb-3"></i>
                  </span>
                  <p>+359882763441</p>
                </ListGroupItem>

                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-mail-line d-flex mb-3"></i>
                  </span>
                  <p>berkcansinan@gmail.com</p>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
          <Col lg="12">
            <p className="footer__copyright">
              Copyright {year} developed by Berkdzhan Halmi. All rights
              reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
