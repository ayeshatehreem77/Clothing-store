import React, { useEffect, useState } from "react";
import axios from "axios";


function ProductsDetails({ product, addToCart }) {
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [alert, setAlert] = useState(null);


  // When product changes, set main image + stop loading
  useEffect(() => {
    if (product?.images?.[0]?.url) {
      setMainImage(`http://localhost:4000${product.images[0].url}`);
      setLoading(false); // stop loading once product is ready
    }
  }, [product]);

  return (
    <div
      className="modal fade"
      id="productsDetails"
      tabIndex="-1"
      aria-labelledby="productsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered my-0">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="#products">Products</a></li>
                <li className="breadcrumb-item active" aria-current="page">{product?.name}</li>
              </ol>
            </nav>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show position-fixed top-100`} role="alert">
              {alert.message}
            </div>
          )}

          {/* Body */}
          <div className="modal-body pt-0">
            <div className="container-fluid">
              <div className="row g-4 align-items-center">

                {/* Left: Product Image */}
                <div className="col-md-6 d-flex flex-column align-items-center">
                  {/* Main Image */}
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt={product?.name}
                      className="img-fluid mb-3"
                      style={{
                        maxHeight: "400px",
                        objectFit: "contain",
                        borderRadius: "15px",
                      }}
                    />
                  )}

                  {/* Thumbnails */}
                  <div className="d-flex gap-2 flex-wrap justify-content-center">
                    {product?.images?.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:4000${img.url}`}
                        alt={`${product?.name} thumbnail ${index + 1}`}
                        className="img-thumbnail"
                        style={{
                          width: "90px",
                          height: "100px",
                          objectFit: "cover",
                          cursor: "pointer",
                          border:
                            mainImage === `http://localhost:4000${img.url}`
                              ? "2px solid #c46c48"
                              : "2px solid transparent",
                          borderRadius: "10px",
                        }}
                        onClick={() => setMainImage(`http://localhost:4000${img.url}`)}
                      />
                    ))}
                  </div>
                </div>

                {/* Right: Product Info */}
                <div className="col-md-6">
                  <h2 className="fw-bold">{product?.name}</h2>
                  <h4 className="text-muted mb-3">${product?.price}</h4>

                  {/* Tags */}
                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-light text-dark px-3 py-2">
                      {product?.gender}
                    </span>
                    <span className="badge bg-light text-dark px-3 py-2">
                      {product?.concentration}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <button
                    className="btn btn-lg w-100 text-white mb-4"
                    style={{ backgroundColor: "#c46c48" }}
                      onClick={() => addToCart(product._id)}
                  >
                    Add to Cart
                  </button>



                  {/* Description */}
                  <p className="mb-3">{product?.description}</p>

                  {/* Notes */}
                  {product?.notes && (
                    <div>
                      <h6 className="fw-bold">Notes:</h6>
                      <ul>
                        {product.notes.top && <li>Top: {product.notes.top}</li>}
                        {product.notes.middle && <li>Middle: {product.notes.middle}</li>}
                        {product.notes.base && <li>Base: {product.notes.base}</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default ProductsDetails