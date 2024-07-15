import React from "react";
import { toast } from "react-toastify";
import { useRef } from "react";
import { Container, Row } from "reactstrap";
import useAuth from "../custom-hooks/useAuth";
import { motion } from "framer-motion";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";
import "../styles/admin-nav.css";

const admin__nav = [
  {
    display: "Dashboard",
    path: "/dashboard",
  },
  {
    display: "Add Products",
    path: "/dashboard/add-products",
  },
  {
    display: "All Products",
    path: "/dashboard/all-products",
  },
  {
    display: "Orders",
    path: "/dashboard/orders",
  },
  {
    display: "Users",
    path: "/dashboard/users",
  },
];

const AdminNav = () => {
  const { currentUser } = useAuth();
  const profileActionRef = useRef(null);
  const navigate = useNavigate();
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
  const toggleProfileActions = () => {
    profileActionRef.current.classList.toggle("show__profileActions");
  };

  return (
    <>
      <header className="admin__header">
        <div className="admin__nav-top">
          <Container>
            <div className="admin__nav-wrapper-top">
              <div className="logo">
                <Link to="/home" style={{ textDecoration: "none" }}>
                  <h2>FierceShooters</h2>
                </Link>
              </div>
              <div className="text-white">
                <span>
                  <h2>Admin Panel</h2>
                </span>
              </div>
              <div className="admin__nav-top-right">
                <img src={currentUser && currentUser.photoURL} alt="" />
                <div
                  className="profile__actions"
                  ref={profileActionRef}
                  onClick={toggleProfileActions}
                >
                  {currentUser ? (
                    <ul className="logged__in-menu">
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
                    // <span onClick={logout}>Log Out</span>
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
                      {/* <Link
                        style={{
                          textDecoration: "none",
                          color: "var(--primary-color)",
                        }}
                        to="/dashboard"
                      >
                        Dashboard
                      </Link> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>
      <section className="admin__menu p-0">
        <Container>
          <Row>
            <div className="admin__navigation">
              <ul className="admin__menu-list">
                {admin__nav.map((item, index) => (
                  <li className="admin__menu-item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__admin-menu" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdminNav;
