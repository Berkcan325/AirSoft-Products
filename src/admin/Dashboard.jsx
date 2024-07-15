import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { data: products } = useGetData("products");
  const { data: users } = useGetData("users");
  const { data: orders } = useGetData("orders"); // Assuming useGetData fetches the entire collection

  useEffect(() => {
    // Optional: You can calculate ordersCount and totalSales here if needed
  }, [orders]);

  // Calculate total sales amount
  const totalSales = orders
    ? orders.reduce((accumulator, order) => accumulator + order.totalAmount, 0)
    : 0;

  // Total number of orders
  const ordersCount = orders ? orders.length : 0;

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col className="lg-3">
              <div className="revenue__box">
                <h5>Total Sales</h5>
                <span>${totalSales.toFixed(2)}</span>
              </div>
            </Col>
            <Col className="lg-3">
              <div className="orders__box">
                <h5>Orders</h5>
                <span>{ordersCount}</span>
              </div>
            </Col>
            <Col className="lg-3">
              <div className="products__box">
                <h5>Total Products</h5>
                <span>{products ? products.length : 0}</span>
              </div>
            </Col>
            <Col className="lg-3">
              <div className="users__box">
                <h5>Total Users</h5>
                <span>{users ? users.length : 0}</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Dashboard;
