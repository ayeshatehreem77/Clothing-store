import React, { useEffect, useState } from "react";
import Alert from "./Alert";

function ProductsDetails({ product, addToCart }) {
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [alert, setAlert] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🧠 Handle feedback form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setAlert({ type: "warning", message: "Please write your feedback first!" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:4000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          text: feedback,
          name: "Anonymous", // or use logged-in user name
          rating: 5, // optional for now
        }),
      });

      if (res.ok) {
        setAlert({ type: "success", message: "Thank you for your feedback!" });
        setFeedback("");
      } else {
        setAlert({ type: "danger", message: "Failed to submit feedback." });
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setAlert({ type: "danger", message: "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return null;

  // 🖼️ Set main image when product changes
  useEffect(() => {
    if (product?.images?.[0]) {
      setMainImage(`http://localhost:4000${product.images[0]}`);
      setLoading(false);
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

          {/* Alert Message */}
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              duration={3000}
              onClose={() => setAlert(null)}
            />
          )}

          {/* Body */}
          <div className="modal-body pt-0">
            <div className="container-fluid">
              <div className="row g-4 align-items-center">
                {/* Left: Product Images */}
                <div className="col-md-6 d-flex flex-column align-items-center">
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
                        src={`http://localhost:4000${img}`}
                        alt={`${product?.name} thumbnail ${index + 1}`}
                        className="img-thumbnail"
                        style={{
                          width: "90px",
                          height: "100px",
                          objectFit: "cover",
                          cursor: "pointer",
                          border:
                            mainImage === `http://localhost:4000${img}`
                              ? "2px solid #c46c48"
                              : "2px solid transparent",
                          borderRadius: "10px",
                        }}
                        onClick={() => setMainImage(`http://localhost:4000${img}`)}
                      />
                    ))}
                  </div>
                </div>

                {/* Right: Product Info */}
                <div className="col-md-6">
                  <h2 className="fw-bold">{product?.name}</h2>
                  <h4 className="text-muted mb-3">PKR {product?.price}</h4>

                  {/* Tags */}
                  <div className="d-flex gap-2 mb-3">
                    {product?.gender && (
                      <span className="badge bg-light text-dark px-3 py-2">
                        {product.gender}
                      </span>
                    )}
                    {product?.concentration && (
                      <span className="badge bg-light text-dark px-3 py-2">
                        {product.concentration}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="btn btn-lg w-100 text-white mb-4"
                    style={{ backgroundColor: "#c46c48" }}
                    onClick={() => {
                      addToCart(product._id);
                      setAlert({
                        type: "success",
                        message: `${product.name} added to cart!`,
                      });
                    }}
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

            <hr />

            {/* Feedback Form */}
            <h6 className="fw-bold mb-3">Leave your feedback:</h6>
            <form onSubmit={handleSubmit}>
              <textarea
                className="form-control mb-3"
                rows="3"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your thoughts about this product..."
              ></textarea>
              <button
                type="submit"
                className="btn btn-dark"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsDetails;
