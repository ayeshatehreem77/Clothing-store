import React, { useEffect, useState } from "react";

function Products({ setSelectedProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/products");
        const data = await res.json();
        setProducts(data.data || data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
                  src={product.image}
                  className="card-img card-img-top"
                  alt={product.name}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">${product.price}</p>
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
