import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"; // include Bootstrap JS

function AddToCart(addToCart) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    const handleCartUpdated = () => fetchCart();
    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, []);

  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  // Fetch cart items
  const fetchCart = async () => {
    if (!token) return alert("Please login first!");
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

 

  // Remove item
  const removeFromCart = async (productId) => {
    if (!token) return;
    try {
      const res = await axios.delete(`http://localhost:4000/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!token) return;
    try {
      const res = await axios.delete("http://localhost:4000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Clear cart error:", err.response?.data || err.message);
    }
  };

  // Initialize Bootstrap modal safely
  useEffect(() => {
    if (!modalRef.current) return;
    bsModalRef.current = new bootstrap.Modal(modalRef.current, {});
    const modalEl = modalRef.current;

    const handleShow = () => fetchCart();
    modalEl.addEventListener("show.bs.modal", handleShow);

    return () => modalEl.removeEventListener("show.bs.modal", handleShow);
  }, []);

  return (
    <>

      {/* Modal */}
      <div
        className="modal fade"
        id="cartModal"
        tabIndex="-1"
        aria-labelledby="cartModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="cartModalLabel">Your Cart</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {loading && <p>Loading...</p>}
              {cartItems.length === 0 && <p>Your cart is empty</p>}
              <ul className="list-group">
                {cartItems.map((item) => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.product?.name} - {item.quantity}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.product?._id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {cartItems.length > 0 && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={clearCart}>
                  Clear Cart
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddToCart;
