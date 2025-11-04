import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import Alert from "./Alert";
import Checkout from "./Checkout";

function AddToCart({ cart, setCart, removeFromCart }) {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [alert, setAlert] = useState(null);


  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  // ✅ Update token and listen for global cart updates
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const handleCartUpdated = () => fetchCart();
    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, []);

  // ✅ Fetch cart items when modal opens
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Cart response:", res.data);
      console.log("✅ Full Cart API Response:", res.data);
      console.log("✅ Items array:", res.data.items);
      setCart(res.data || { items: [] });
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };


  // ✅ Clear cart
  const clearCart = async () => {
    if (!token) return;
    try {
      const res = await axios.delete("http://localhost:4000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Clear cart error:", err.response?.data || err.message);
    }
  };

  // ✅ Initialize Bootstrap modal safely
  useEffect(() => {
    if (!modalRef.current) return;
    bsModalRef.current = new bootstrap.Modal(modalRef.current, {});
    const modalEl = modalRef.current;

    const handleShow = () => fetchCart();
    modalEl.addEventListener("show.bs.modal", handleShow);

    return () => modalEl.removeEventListener("show.bs.modal", handleShow);
  }, [token]);

  return (
    <>
      {/* Cart Modal */}
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
              <h5 className="modal-title" id="cartModalLabel">
                Your Cart
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                duration={3000}
                onClose={() => setAlert(null)}
              />
            )}

            <div className="modal-body">
              {loading && <p>Loading...</p>}
              {!loading && cart.items?.length === 0 && <p>Your cart is empty</p>}

              <ul className="list-group">
                {cart.items?.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {item.product?.name} — {item.quantity}
                    </div>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        removeFromCart(item.product._id); // your existing remove logic
                        setAlert({
                          type: "danger",
                          message: `${item.product.name} removed from cart!`,
                        });
                      }}
                    >
                      Remove
                    </button>

                  </li>
                ))}
              </ul>
            </div>


            {cart.length > 0 && (
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
            <Checkout cartItems={cartItems} token={token} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AddToCart;
