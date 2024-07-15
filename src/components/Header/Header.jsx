import React, { useRef, useEffect, useState } from "react";
import "./header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import userIcon from "../../assets/images/default-user-icon.png";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import useAuth from "../../custom-hooks/useAuth";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.config";
import logo from "../../assets/images/logo.jpg";
import { Container, Row } from "reactstrap";
import { toast } from "react-toastify";
import checkUserRole from "../../admin/checkUserRole";

const nav__links = [
  {
    path: "home",
    display: "Home",
  },
  {
    path: "shop",
    display: "Shop",
  },
  {
    path: "cart",
    display: "Cart",
  },
];

const Header = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User logged in:", user); // Log current user
        try {
          const role = await checkUserRole(user.uid);
          console.log("Fetched user role:", role); // Log fetched role
          setUserRole(role);
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      } else {
        console.log("No user is currently logged in");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalLiked = useSelector(
    (state) => state.favorites.favoriteItems.length
  ); // Selector to get the total number of favorited items
  const profileActionRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      if (headerRef.current) {
        if (
          document.body.scrollTop > 80 ||
          document.documentElement.scrollTop > 80
        ) {
          headerRef.current.classList.add("sticky__header");
        } else {
          headerRef.current.classList.remove("sticky__header");
        }
      }
    });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out");
        navigate("/home");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    stickyHeaderFunc();
    return () => window.removeEventListener("scroll", stickyHeaderFunc);
  });

  const menuToggle = () => menuRef.current.classList.toggle("active__menu");

  const navigateToCart = () => {
    navigate("/cart");
  };
  const navigateToFavorites = () => {
    navigate("/favorites"); // Update the path to your Favorites page
  };

  const toggleProfileActions = () => {
    profileActionRef.current.classList.toggle("show__profileActions");
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <Link to="/home" style={{ textDecoration: "none" }}>
              <div className="logo">
                <img src={logo} alt="logo" />
                <div>
                  <h1>FierceShooters</h1>
                </div>
              </div>
            </Link>
            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav__icons">
              <motion.span
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 1.3 }}
                className="fav__icon"
                onClick={navigateToFavorites}
              >
                <i className="ri-heart-line"></i>
                <span className="badge">{totalLiked}</span>
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 1.3 }}
                className="cart__icon"
                onClick={navigateToCart}
              >
                <i className="ri-shopping-bag-4-line"></i>
                <span className="badge">{totalQuantity}</span>
              </motion.span>
              <div className="profile">
                <motion.img
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.3 }}
                  src={currentUser ? currentUser.photoURL : userIcon}
                  alt=""
                  onClick={toggleProfileActions}
                />
                <div
                  className="profile__actions"
                  ref={profileActionRef}
                  onClick={toggleProfileActions}
                >
                  {currentUser ? (
                    userRole === "admin" ? (
                      <ul className="logged__in-menu">
                        <li>
                          <Link
                            style={{
                              textDecoration: "none",
                              color: "var(--primary-color)",
                            }}
                            to="/profile"
                          >
                            <span>Profile</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            style={{
                              textDecoration: "none",
                              color: "var(--primary-color)",
                            }}
                            to="/dashboard"
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <span onClick={logout}>Log Out</span>
                        </li>
                      </ul>
                    ) : (
                      <ul className="logged__in-menu">
                        <li>
                          <Link
                            style={{
                              textDecoration: "none",
                              color: "var(--primary-color)",
                            }}
                            to="/profile"
                          >
                            <span>Profile</span>
                          </Link>
                        </li>
                        <li>
                          <span onClick={logout}>Log Out</span>
                        </li>
                      </ul>
                    )
                  ) : (
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "var(--primary-color)",
                        }}
                        to="/login"
                      >
                        Log In
                      </Link>
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "var(--primary-color)",
                        }}
                        to="/signup"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
