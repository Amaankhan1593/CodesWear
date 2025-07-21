"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";
import { IoBagCheckSharp } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";

const Nabvar = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  // console.log(cart, addToCart, removeFromCart, clearCart, subTotal);
  const toggleCart = () => {
    if (ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
    } else {
      ref.current.classList.contains("translate-x-full");
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
    }
  };
  const ref = useRef();
  return (
    <div className="flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 bg-white z-10">
      <div className="logo mx-5">
        <Link href={"/"}>
          <img width={200} height={30} src="/logo.png" alt="" />
        </Link>
      </div>
      <div className="nav">
        <ul className="flex items-center space-x-6 font-bold md:text-md">
          <li className=" hover:text-pink-600">
            <Link href="/tshirts">Tshirts</Link>
          </li>
          <li className=" hover:text-pink-600">
            <Link href="/hoodies">Hoodies</Link>
          </li>
          <li className=" hover:text-pink-600">
            <Link href="/perfume">Perfumes</Link>
          </li>
          <li className=" hover:text-pink-600">
            <Link href="/watches">Watches</Link>
          </li>
        </ul>
      </div>
      <div className="cursor-pointer cart absolute right-0 top-4 mx-5 flex">
        <Link href={"/login"}>
          <RiAccountCircleFill className="text-xl md:text-3xl  text-pink-500" />
        </Link>
        <IoCartOutline
          onClick={toggleCart}
          className="text-xl md:text-3xl  text-pink-500"
        />
      </div>

      <div ref={ref} className="w-72 h-[100vh] sideCart overflow-y-scroll absolute top-0 right-0 bg-pink-200 px-8 py-10 transform transition-transform translate-x-full z-50">
        <h2 className="font-bold text-xl text-center">Shopping Cart </h2>
        <span
          onClick={toggleCart}
          className="absolute top-5 right-2 cursor-pointer text-2xl text-pink-500"
        >
          <IoIosCloseCircle />
        </span>
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length==0 && <div className="my-4 font-semibold">Your cart is empty</div>}
              
          {Object.keys(cart).map((k) => {
            return (
              <li key={k}>
                <div className="item flex my-5">
                  <div className="w-2/3 font-semibold">{cart[k].name}</div>
                  <div className="flex font-semibold items-center justify-center w-1/2 text-lg">
                    <FaCircleMinus onClick={()=>{removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant)}} className="cursor-pointer text-pink-500" />
                    <span className="mx-2 text-sm">{cart[k].qty}</span>
                    <FaCirclePlus onClick={()=>{addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant)}} className="cursor-pointer text-pink-500" />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="font-bold my-2">Subtotal: Rs{subTotal}</div>
        <div className="flex">
          <Link href={"/checkout"}>
            <button className="flex mr-2  text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg">
              <IoBagCheckSharp className="m-1" />
              Checkout
            </button>
          </Link>
          <button
            onClick={clearCart}
            className="flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg"
          >
            ClearCart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nabvar;
