import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { db } from "../firebase.config";
import {
  doc,
  deleteDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { data: productsData, loading } = useGetData("products");
  const [editModal, setEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productProperties, setProductProperties] = useState({});

  const deleteProduct = async (id) => {
    const productDocRef = doc(db, "products", id);
    const reviewsCollectionRef = collection(productDocRef, "reviews");

    try {
      const reviewsSnapshot = await getDocs(reviewsCollectionRef);
      reviewsSnapshot.forEach(async (reviewDoc) => {
        await deleteDoc(reviewDoc.ref);
      });
      await deleteDoc(productDocRef);

      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product and reviews: ", error);
      toast.error("Failed to delete the product and associated reviews");
    }
  };

  const toggleEditModal = (product) => {
    setCurrentProduct(product);
    setProductProperties(product);
    setEditModal(!editModal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductProperties((prevProperties) => ({
      ...prevProperties,
      [name]: value,
    }));
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    try {
      const productDocRef = doc(db, "products", currentProduct.id);
      await updateDoc(productDocRef, productProperties);

      setEditModal(false);
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product: ", error);
      toast.error("Failed to update the product");
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h4 className="py-5 text-center fw-bold">Loading...</h4>
                ) : (
                  productsData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.imgUrls[0]} alt="" />
                      </td>
                      <td>{item.productName}</td>
                      <td>{item.category}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <button
                          onClick={() => deleteProduct(item.id)}
                          className="btn-danger btn"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => toggleEditModal(item)}
                          className="btn-info btn"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>

      {currentProduct && (
        <Modal isOpen={editModal} toggle={() => toggleEditModal(null)}>
          <Form onSubmit={handleEditProduct}>
            <ModalHeader toggle={() => toggleEditModal(null)}>
              Edit Product
            </ModalHeader>
            <ModalBody>
              {Object.keys(productProperties).map((key) => (
                <FormGroup key={key}>
                  <Label for={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  <Input
                    type={key === "price" ? "number" : "text"}
                    name={key}
                    id={key}
                    value={productProperties[key]}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Save
              </Button>
              <Button color="secondary" onClick={() => toggleEditModal(null)}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      )}
    </section>
  );
};

export default AllProducts;
