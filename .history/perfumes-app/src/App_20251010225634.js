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



function App() {

  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);


  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
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
      <AddToCart cart={cart} removeFromCart={removeFromCart} />
      <Login user={user} setUser={setUser} setShowModal={setShowModal} />
      <Footer />
    </>
  );
}

export default App;
