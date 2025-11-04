import React, { useState } from "react";
import axios from "axios";

const Checkout = ({ cartItems, token, onOrderPlaced }) => {
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const totalPrice = cartItems.reduce(
  (sum, item) => sum + ((item.product?.price || item.price || 0) * item.quantity),
  0
);



    const handleCheckout = async () => {
        if (!cartItems.length) return setMessage("Your cart is empty.");

        setLoading(true);
        setMessage("");

        const orderData = {
            products: cartItems.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
            })),
            totalPrice,
        };

        console.log("🛒 Sending order data:", orderData);

        try {
            const res = await axios.post("http://localhost:4000/orders", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("✅ Order placed successfully!");
            console.log("✅ Order Response:", res.data);

            if (onOrderPlaced) onOrderPlaced(res.data);
        } catch (err) {
            console.error("❌ Checkout error:", err.response?.data || err.message);
            setMessage("❌ Failed to place order. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">Checkout</h2>

            <ul className="list-group mb-3">
                {cartItems.map((item) => (
                    <li
                        key={item._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        {item.product?.name} × {item.quantity}
                        <span>${(item.product?.price || 0) * item.quantity}</span>
                    </li>
                ))}
            </ul>

            <h5 className="mb-4">Total: ${totalPrice}</h5>

            <button
                className="btn btn-dark px-4"
                onClick={handleCheckout}
                disabled={loading}
            >
                {loading ? "Placing Order..." : "Place Order"}
            </button>

            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default Checkout;
