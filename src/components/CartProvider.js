"use client";
import React, { createContext, useState, useEffect } from "react";
import Nabvar from "./Nabvar";
import { useRouter } from 'next/navigation';
// import LoadingBar from "react-top-loading-bar";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({value: null})
  const [key, setKey] = useState(0)
  // const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // router.events.on('routeChangeStart', ()=>{
    //   setProgress(100)
    // })
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
    const token = localStorage.getItem('token')
    if (token) {
      setUser({value: token})
      setKey(Math.random())
    }
  }, []);

 const logout = ()=>{
  localStorage.removeItem('token')
  setUser({value: null})
  setKey(Math.random())
  router.push('/')
 }

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

  const removeFromCart = (itemCode, qty) => {
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
    <>
     {/* <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      /> */}
    <CartContext.Provider
      value={{
        cart,
        subTotal,
        user,
        key,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      <Nabvar
        cart={cart}
        addToCart={addToCart}
        user={user}
        key={key}
        Logout={logout}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
      />
      {children}
    </CartContext.Provider>
    </>
  );
};

export default CartProvider;
