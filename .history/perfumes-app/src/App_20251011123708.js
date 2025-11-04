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


function App() {

  const [cart, setCart] = useState([]); // ✅ empty array by default
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);


  // 🛒 Add item
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

      // ✅ Always store only the items array
      const items = Array.isArray(res.data?.items)
        ? res.data.items
        : Array.isArray(res.data)
          ? res.data
          : [];

      setCart(items);
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
    }
  };




  const removeFromCart = async (productId) => {
    console.log("🗑️ Deleting:", `http://localhost:4000/cart/${productId}`);

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

      // ✅ Only update with returned items (not emptying full cart)
      if (data && Array.isArray(data.items)) {
        setCart(data.items);
      } else if (data && data.items && Array.isArray(data.items)) {
        setCart(data.items);
      } else {
        console.warn("⚠️ Unexpected response, removing locally");
        setCart((prev) =>
          Array.isArray(prev)
            ? prev.filter(
              (item) =>
                item.product?._id !== productId &&
                item.productId !== productId
            )
            : []
        );
      }
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
      <Footer />
    </>
  );
}

export default App;
