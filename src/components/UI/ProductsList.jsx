import React from "react";
import ProductCard from "./ProductCard";

const ProductsList = ({ data }) => {
  return (
    <div className="product__list">
      {data.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          thumbnail={product.imgUrls[0]}
        />
      ))}
    </div>
  );
};

export default ProductsList;
