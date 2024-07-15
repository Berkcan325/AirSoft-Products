import React, { useState, useEffect } from "react";
import useGetData from "../custom-hooks/useGetData";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import "../styles/shop.css";
import ProductsList from "../components/UI/ProductsList";

const Shop = () => {
  const { data: products, loading } = useGetData("products");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filters, setFilters] = useState({
    smg: false,
    ar: false,
    sniper: false,
    shotgun: false,
    pistol: false,
    helmet: false,
    mask: false,
    gloves: false,
    vest: false,
    goggles: false,
    shoes: false,
    top: false,
    bottom: false,
    scope: false,
    stand: false,
    stock: false,
    magazine: false,
    laser: false,
    silencer: false,
  });

  useEffect(() => {
    handleFilter();
  }, [filters, minPrice, maxPrice, products, sortOrder, searchTerm]);

  const handleSort = (e) => {
    const { value } = e.target;
    setSortOrder(value);
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFilter = () => {
    let filtered = products;

    const activeFilters = Object.entries(filters)
      .filter(([key, value]) => value)
      .map(([key]) => key.toLowerCase());

    if (activeFilters.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.category &&
          activeFilters.includes(product.category.toLowerCase())
      );
    }

    if (minPrice !== "") {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(maxPrice)
      );
    }

    if (searchTerm !== "") {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "descending") {
      filtered = filtered.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );
    } else if (sortOrder === "ascending") {
      filtered = filtered.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
    setFilters({
      smg: false,
      ar: false,
      sniper: false,
      shotgun: false,
      pistol: false,
      helmet: false,
      mask: false,
      gloves: false,
      vest: false,
      goggles: false,
      shoes: false,
      top: false,
      bottom: false,
      scope: false,
      stand: false,
      stock: false,
      magazine: false,
      laser: false,
      silencer: false,
    });
    setFilteredProducts(products);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Helmet title="Shop">
      <CommonSection title="Products" />
      <section>
        <Container>
          <Row>
            <Col lg="3" md="4">
              <div className="filter__widget">
                <h4>Filters</h4>
                <div className="filter__checkboxes">
                  <input
                    className="mb-2"
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                  <button className="buy__btn" onClick={handleReset}>
                    Reset Filters
                  </button>
                  <h3>Replicas</h3>
                  <label>
                    <input
                      type="checkbox"
                      name="smg"
                      checked={filters.smg}
                      onChange={handleFilterChange}
                    />{" "}
                    SMG
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="ar"
                      checked={filters.ar}
                      onChange={handleFilterChange}
                    />{" "}
                    Assault Rifle
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="sniper"
                      checked={filters.sniper}
                      onChange={handleFilterChange}
                    />{" "}
                    Sniper
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="shotgun"
                      checked={filters.shotgun}
                      onChange={handleFilterChange}
                    />{" "}
                    Shotgun
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="pistol"
                      checked={filters.pistol}
                      onChange={handleFilterChange}
                    />{" "}
                    Pistol
                  </label>
                  <h3>Equipment</h3>
                  <label>
                    <input
                      type="checkbox"
                      name="helmet"
                      checked={filters.helmet}
                      onChange={handleFilterChange}
                    />{" "}
                    Helmet
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="mask"
                      checked={filters.mask}
                      onChange={handleFilterChange}
                    />{" "}
                    Mask
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="gloves"
                      checked={filters.gloves}
                      onChange={handleFilterChange}
                    />{" "}
                    Gloves
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="vest"
                      checked={filters.vest}
                      onChange={handleFilterChange}
                    />{" "}
                    Vest
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="goggles"
                      checked={filters.goggles}
                      onChange={handleFilterChange}
                    />{" "}
                    Goggles
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="shoes"
                      checked={filters.shoes}
                      onChange={handleFilterChange}
                    />{" "}
                    Shoes
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="top"
                      checked={filters.top}
                      onChange={handleFilterChange}
                    />{" "}
                    Top
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="bottom"
                      checked={filters.bottom}
                      onChange={handleFilterChange}
                    />{" "}
                    Bottom
                  </label>
                  <h3>Attachments</h3>
                  <label>
                    <input
                      type="checkbox"
                      name="scope"
                      checked={filters.scope}
                      onChange={handleFilterChange}
                    />{" "}
                    Scope
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="stand"
                      checked={filters.stand}
                      onChange={handleFilterChange}
                    />{" "}
                    Stand
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="stock"
                      checked={filters.stock}
                      onChange={handleFilterChange}
                    />{" "}
                    Stock
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="magazine"
                      checked={filters.magazine}
                      onChange={handleFilterChange}
                    />{" "}
                    Magazine
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="laser"
                      checked={filters.laser}
                      onChange={handleFilterChange}
                    />{" "}
                    Laser
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="silencer"
                      checked={filters.silencer}
                      onChange={handleFilterChange}
                    />{" "}
                    Silencer
                  </label>
                </div>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="search__box mb-5">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
              <section className="pt-0">
                <Container>
                  <Row>
                    {filteredProducts.length === 0 ? (
                      <h1 className="text-center fs-4">
                        No products are found!
                      </h1>
                    ) : (
                      <div className="products">
                        <ProductsList
                          data={filteredProducts.map((product) => ({
                            ...product,
                            imgUrl: product.imgUrls[0],
                          }))}
                        />
                      </div>
                    )}
                  </Row>
                </Container>
              </section>
            </Col>
            <Col lg="3" md="4">
              <div className="filter__widget">
                <h4>Sort by Price</h4>
                <select onChange={handleSort} value={sortOrder}>
                  <option value="">Default</option>
                  <option value="ascending">Price: Low to High</option>
                  <option value="descending">Price: High to Low</option>
                </select>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Shop;
