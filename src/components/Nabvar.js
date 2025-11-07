
"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { IoCartOutline, IoBagCheckSharp } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { RiAccountCircleFill } from "react-icons/ri";
import Image from "next/image";

const Nabvar = ({ Logout, user, cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef();

  const toggleCart = () => {
    if (ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
    } else {
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
    }
  };

  // Buy it now handler (Stripe Checkout)
  const handleBuyNow = async () => {
    try {
      const items = Object.keys(cart).map((k) => ({
        id: k,
        name: cart[k].name,
        price: cart[k].price,
        quantity: cart[k].qty,
        image: cart[k].img || "", // if you store image
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: "pkr", items }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        alert(data?.error || "Unable to start checkout");
      }
    } catch (err) {
      console.error("Checkout error", err);
      alert("Something went wrong starting checkout");
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 bg-white z-10">
      {/* Logo */}
      <div className="logo mx-5">
        <Link href="/">
          <Image width={200} height={30} src="/logo.png" alt="Logo" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="nav">
        <ul className="flex items-center space-x-6 font-bold md:text-md">
          <li className="hover:text-pink-600"><Link href="/tshirts">Tshirts</Link></li>
          <li className="hover:text-pink-600"><Link href="/hoodies">Hoodies</Link></li>
          <li className="hover:text-pink-600"><Link href="/perfume">Perfumes</Link></li>
          <li className="hover:text-pink-600"><Link href="/watches">Watches</Link></li>
        </ul>
      </div>

      {/* User & Cart Section */}
      <div className="cursor-pointer cart absolute right-0 top-4 mx-5 flex items-center space-x-4">
        {/* Dropdown Hover */}
        <div
          className="relative"
          onMouseEnter={() => setDropdown(true)}
          onMouseLeave={() => setDropdown(false)}
        >
          {user.value && (
            <RiAccountCircleFill className="text-xl md:text-3xl text-pink-500" />
          )}

          {dropdown && (
            <div className="absolute right-8 top-7 bg-pink-300 py-4 rounded-md px-5 w-32 font-bold">
              <ul>
                <li className="py-1 hover:text-pink-700 text-sm">
                  <Link href="/myaccount">My Account</Link>
                </li>
                <li className="py-1 hover:text-pink-700 text-sm">
                  <Link href="/orders">Orders</Link>
                </li>
                <li onClick={Logout} className="py-1 hover:text-pink-700 text-sm cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Show Login Button if not logged in */}
        {!user.value && (
          <Link href="/login">
            <button className="bg-pink-500 px-2 py-1 rounded-md text-sm text-white">
              Login
            </button>
          </Link>
        )}

        {/* Cart Icon */}
        <IoCartOutline
          onClick={toggleCart}
          className="text-xl md:text-3xl text-pink-500"
        />
      </div>

      {/* Cart Sidebar */}
      <div
        ref={ref}
        className="w-72 h-[100vh] sideCart overflow-y-scroll absolute top-0 right-0 bg-pink-200 px-8 py-10 transform transition-transform translate-x-full z-50"
      >
        <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
        <span
          onClick={toggleCart}
          className="absolute top-5 right-2 cursor-pointer text-2xl text-pink-500"
        >
          <IoIosCloseCircle />
        </span>

        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length === 0 && (
            <div className="my-4 font-semibold">Your cart is empty</div>
          )}
          {Object.keys(cart).map((k) => (
            <li key={k}>
              <div className="item flex my-5">
                <div className="w-2/3 font-semibold">{cart[k].name}</div>
                <div className="flex font-semibold items-center justify-center w-1/2 text-lg">
                  <FaCircleMinus
                    onClick={() =>
                      removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant)
                    }
                    className="cursor-pointer text-pink-500"
                  />
                  <span className="mx-2 text-sm">{cart[k].qty}</span>
                  <FaCirclePlus
                    onClick={() =>
                      addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant)
                    }
                    className="cursor-pointer text-pink-500"
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="font-bold my-2">Subtotal: Rs{subTotal}</div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center text-white bg-green-500 border-0 py-2 px-2 hover:bg-green-600 rounded text-sm"
          >
            <IoBagCheckSharp className="mr-2" /> Buy It Now
          </button>
          <button
            onClick={clearCart}
            className="flex items-center justify-center text-white bg-pink-500 border-0 py-2 px-2 hover:bg-pink-600 rounded text-sm"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nabvar;
