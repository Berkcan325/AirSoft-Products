import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import useGetData from "../custom-hooks/useGetData";

const Orders = () => {
  const { data: ordersData, loading } = useGetData("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(!modalOpen);
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            {loading ? (
              <h4 className="py-5 text-center fw-bold">Loading...</h4>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Total Amount</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData && ordersData.length > 0 ? (
                    ordersData.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => toggleModal(order)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{order.id}</td>
                        <td>{order.name}</td>
                        <td>${order.totalAmount}</td>
                        <td>
                          {new Date(
                            order.createdAt.toDate()
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>

      {selectedOrder && (
        <Modal isOpen={modalOpen} toggle={() => toggleModal(null)}>
          <ModalHeader toggle={() => toggleModal(null)}>
            Order Details
          </ModalHeader>
          <ModalBody>
            <h5>Customer Details</h5>
            <p>
              <strong>Name:</strong> {selectedOrder.name}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedOrder.phone}
            </p>

            <h5>Products Ordered</h5>
            {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 ? (
              selectedOrder.cartItems.map((item, index) => (
                <div key={index}>
                  <p>
                    <strong>Product Name:</strong> {item.productName}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ${item.totalPrice}
                  </p>
                  <hr />
                </div>
              ))
            ) : (
              <p>No products listed</p>
            )}

            <h5>Order Summary</h5>
            <p>
              <strong>Total Amount:</strong> ${selectedOrder.totalAmount}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(selectedOrder.createdAt.toDate()).toLocaleDateString()}
            </p>
          </ModalBody>
        </Modal>
      )}
    </section>
  );
};

export default Orders;
