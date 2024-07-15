import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [productType, setProductType] = useState("");
  const [productName, setName] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [fps, setFps] = useState("");
  const [magazineCapacity, setMagazineCapacity] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (images.length === 0) {
        throw new Error("Please upload at least one image.");
      }

      const imageUploadPromises = images.map((image) => {
        const storageRef = ref(
          storage,
          `productImages/${Date.now()}_${image.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, image);
        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            () => {}, // Progress handler (optional)
            reject, // Error handler
            () => resolve(getDownloadURL(uploadTask.snapshot.ref)) // Resolve with download URL upon success
          );
        });
      });

      const downloadURLs = await Promise.all(imageUploadPromises);

      const productData = {
        productName,
        description,
        category,
        price: parseFloat(price),
        quantity,
        imgUrls: downloadURLs,
        rating: 0,
        numberOfRates: 0,
        manufacturer,
        color,
        material,
      };

      if (productType === "airsoft_replica") {
        Object.assign(productData, { fps, magazineCapacity, weight });
      }

      await addDoc(collection(db, "products"), productData);

      setLoading(false);
      toast.success("Product added successfully!");
      navigate("/dashboard/all-products");
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Failed to add the product!");
      console.error("Add product error: ", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col lg="12">
          {loading ? (
            <h4 className="py-5">Loading...</h4>
          ) : (
            <>
              <h4 className="mb-4">Add Product</h4>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="productType">Product Type</Label>
                  <Input
                    type="select"
                    id="productType"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    required
                  >
                    <option value="">Select product type</option>
                    <option value="airsoft_replica">Airsoft Replica</option>
                    <option value="equipment">Equipment</option>
                    <option value="attachment">Attachment</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="name">Product Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={productName}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="manufacturer">Manufacturer</Label>
                  <Input
                    type="text"
                    id="manufacturer"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="weight">Weight</Label>
                  <Input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="material">Material</Label>
                  <Input
                    type="text"
                    id="material"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="color">Color</Label>
                  <Input
                    type="text"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  />
                </FormGroup>
                {productType === "airsoft_replica" && (
                  <>
                    <FormGroup>
                      <Label for="fps">FPS (Feet per Second)</Label>
                      <Input
                        type="number"
                        id="fps"
                        value={fps}
                        onChange={(e) => setFps(e.target.value)}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="magazineCapacity">Magazine Capacity</Label>
                      <Input
                        type="number"
                        id="magazineCapacity"
                        value={magazineCapacity}
                        onChange={(e) => setMagazineCapacity(e.target.value)}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="category">Category</Label>
                      <Input
                        type="select"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="ar">Assault Rifle</option>
                        <option value="smg">SMG</option>
                        <option value="sniper">Sniper</option>
                        <option value="shotgun">Shotgun</option>
                        <option value="pistol">Pistol</option>
                      </Input>
                    </FormGroup>
                  </>
                )}
                {productType === "equipment" && (
                  <>
                    <FormGroup>
                      <Label for="category">Category</Label>
                      <Input
                        type="select"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="helmet">Helmet</option>
                        <option value="mask">Mask</option>
                        <option value="gloves">Gloves</option>
                        <option value="vest">Vest</option>
                        <option value="goggles">Goggles</option>
                        <option value="shoes">Shoes</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                      </Input>
                    </FormGroup>
                  </>
                )}
                {productType === "attachment" && (
                  <>
                    <FormGroup>
                      <Label for="category">Category</Label>
                      <Input
                        type="select"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="scope">Scope</option>
                        <option value="stand">Stand</option>
                        <option value="stock">Stock</option>
                        <option value="magazine">Magazine</option>
                        <option value="laser">Laser</option>
                        <option value="silencer">Silencer</option>
                      </Input>
                    </FormGroup>
                  </>
                )}
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="quantity">Quantity</Label>
                  <Input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="image">Product Image(s)</Label>
                  <Input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    multiple
                    required
                  />
                </FormGroup>
                <Button type="submit" color="primary">
                  Add Product
                </Button>
              </Form>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
