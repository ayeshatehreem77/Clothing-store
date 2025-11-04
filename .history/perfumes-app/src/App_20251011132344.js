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


  // Add item
  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.items.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        // Increase quantity
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        // Add new item
        return {
          ...prev,
          items: [...prev.items, { product, quantity: 1 }],
        };
      }
    });
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
