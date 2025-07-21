"use client";

import React, { createContext, useState, useEffect } from "react";
import Nabvar from "./Nabvar";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
  }, []);

  // Update subtotal whenever cart changes
  useEffect(() => {
    let total = 0;
    Object.values(cart).forEach((item) => {
      total += item.price * item.qty;
    });
    setSubTotal(total);
  }, [cart]);

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
  };

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty += qty;
    } else {
      newCart[itemCode] = { qty, price, name, size, variant };
    }
    setCart(newCart);
   console.log(newCart)
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const removeFromCart = (itemCode, qty, price, name, size, variant ) => {
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }
    setCart(newCart);
    saveCart(newCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        subTotal,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      <Nabvar
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
      />
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
