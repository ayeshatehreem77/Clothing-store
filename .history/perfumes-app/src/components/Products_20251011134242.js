import React, { useEffect, useState } from "react";

function Products({ setSelectedProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/products");
        const data = await res.json();
        setProducts(data.data || data);

        const initialQuantities = {};
        (data.data || data).forEach((p) => {
          initialQuantities[p._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  if (loading) return <p className="text-center">Loading products...</p>;

  return (
    <div id="products" className="products-section py-5">
      <div className="container w-75">
        <div className="product-text text-center mb-5">
          <h2>Our Products</h2>
          <p className="mx-5 mb-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div
                className="card border-0 product-card h-100"
                data-bs-toggle="modal"
                data-bs-target="#productsDetails"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={`http://localhost:4000${product.images?.[0]?.url}`}
                  className="card-img card-img-top"
                  alt={product.name}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">${product.price}</p>

                  {/* Quantity buttons, minimal UI change */}
                  <div className="d-flex justify-content-center align-items-center mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        decreaseQuantity(product._id);
                      }}
                    >
                      -
                    </button>
                    <span>{quantities[product._id] || 1}</span>
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        increaseQuantity(product._id);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
