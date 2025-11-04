import './App.css';
import Aboutus from './components/Aboutus';
import ContactForm from './components/ContactForm';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';
import Login from './components/Login';
import Hero from './components/Hero';
import Products from './components/Products';
import ProductsDetails from './components/ProductsDetails';
import AddToCart from './components/AddToCart';
import React, { useState } from 'react';
import axios from 'axios';
import Alert from './components/Alert';


function App() {

  const [cart, setCart] = useState([]); // ✅ empty array by default
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(null);



  // Add item
  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("🛒 Cart API response:", res.data);
      // ✅ Always ensure it's an array
      if (Array.isArray(res.data.items)) {
        setCart(res.data.items);
      } else if (Array.isArray(res.data)) {
        setCart(res.data);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
    }
  };



  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:4000/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log("✅ Full Cart API Response:", data);

      if (data && Array.isArray(data.items)) {
        // Backend returned updated cart
        setCart({ items: data.items });
      } else {
        // Backend didn't return items, fallback locally
        setCart((prev) => ({
          ...prev,
          items: prev.items.filter(
            (item) =>
              (item.product?._id || item.productId).toString() !== productId.toString()
          ),
        }));
      }
      // 2️⃣ Show alert
      setAlert({
        type: "danger", // red alert for removal
        message: `${productName} removed from cart!`,
      });
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };


  return (
    <>
      <Hero />
      <Aboutus />
      <Products
        setSelectedProduct={setSelectedProduct}
      />
      <ProductsDetails
        product={selectedProduct}
        addToCart={addToCart}
      />
      <ContactForm />
      <ContactModal />
      <AddToCart cart={cart} setCart={setCart} addToCart={addToCart} removeFromCart={removeFromCart} />
      <Login user={user} setUser={setUser} setShowModal={setShowModal} showModal={showModal} />
      <Alert
        type="success"
        message={message}
        duration={3000}
        onClose={() => setMessage("")}
      />
      <Footer />
    </>
  );
}

export default App;
