'use client'
import React from 'react'
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";
import { IoBagCheckSharp } from "react-icons/io5";
import Link from 'next/link';

const checkout = ({cart, clearCart, addToCart, removeFromCart}) => {
  return (
    <div className='container m-auto'>
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      <h2 className='font-bold text-xl '>1. Delivery Details</h2>
      <div className="mx-auto flex my-2">
        <div className="px-2 w-1/2">
        <div className=" mb-4">
        <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
        <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
        </div>
        <div className="px-2 w-1/2">
        <div className=" mb-4">
        <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
        <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
        </div>
        </div>
        <div className="px-2 w-full">
        <div className="mb-4">
        <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
        <textarea name="address" id="address" rows="2" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>
      </div>
        </div>
        <div className="mx-auto flex my-2">
        <div className="px-2 w-1/2">
        <div className=" mb-4">
        <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
        <input type="phone" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
        </div>
        <div className="px-2 w-1/2">
        <div className=" mb-4">
        <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
        <input type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
        </div>
        </div>
        <div className="mx-auto flex my-2">
        <div className="px-2 w-1/2">
        <div className=" mb-4">
        <label htmlFor="State" className="leading-7 text-sm text-gray-600">State</label>
        <input type="text" id="State" name="State" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
        </div>
        <div className="px-2 w-1/2">
        <div className=" mb-4">
        <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">PinCode</label>
        <input type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
        </div>
        </div>

        <h2 className='font-bold text-xl '>2. Review Cart Items</h2>
           <div className="w-72 h-[100vh] sideCart  bg-pink-200 px-8 py-10 transform transition-transform translate-x-full z-50">
                 <h2 className="font-bold text-xl text-center">Shopping Cart </h2>
                 <ol className="list-decimal font-semibold">
                  { cart && Object.keys(cart).length === 0 && (
  <div className="my-4 font-semibold">Your cart is empty</div>
)}

{cart && Object.keys(cart).map((k) => {
  return (
    <li key={k}>
      <div className="item flex my-5">
        <div className="w-2/3 font-semibold">{cart[k].name}</div>
        <div className="flex font-semibold items-center justify-center w-1/2 text-lg">
          <FaCircleMinus
            onClick={() =>
              removeFromCart(
                k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant
              )
            }
            className="cursor-pointer text-pink-500"
          />
          <span className="mx-2 text-sm">{cart[k].qty}</span>
          <FaCirclePlus
            onClick={() =>
              addToCart(
                k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant
              )
            }
            className="cursor-pointer text-pink-500"
          />
        </div>
      </div>
    </li>
  );
})}
                 </ol>
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
  )
}

export default checkout
