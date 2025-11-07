'use client';
import React from 'react';
import { FaCirclePlus, FaCircleMinus } from 'react-icons/fa6';
import { IoBagCheckSharp } from 'react-icons/io5';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Checkout = () => {
  // const router = useRouter();

  // const handleCheckout = async () => {
  //   const res = await fetch('/api/checkout-session', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ cart, subTotal }),
  //   });

  //   const data = await res.json();
  //   if (data.url) {
  //     router.push(data.url);
  //   } else {
  //     alert('Payment error. Please try again.');
  //   }
  // };

  return (
    <div className='container m-auto'>
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>

      <h2 className='font-bold text-xl mb-2'>1. Delivery Details</h2>
      <div className="mx-auto flex my-2">
        <div className="px-2 w-1/2">
          <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
          <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3" />
        </div>
        <div className="px-2 w-1/2">
          <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
          <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3" />
        </div>
      </div>

      <div className="px-2 w-full">
        <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
        <textarea id="address" rows="2" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3" />
      </div>

      <div className="mx-auto flex my-2">
        <div className="px-2 w-1/2">
          <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
          <input type="tel" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3" />
        </div>
        <div className="px-2 w-1/2">
          <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
          <input type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3" />
        </div>
      </div>

      <div className="mx-auto flex my-2">
        <div className="px-2 w-1/2">
          <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
          <input type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3" />
        </div>
        <div className="px-2 w-1/2">
          <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">PinCode</label>
          <input type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3" />
        </div>
      </div>

      {/* <h2 className='font-bold text-xl mt-8 mb-4'>2. Review Cart Items</h2>
      <div className="sideCart bg-pink-200 p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-xl text-center mb-4">Shopping Cart</h2>

        <ol className="list-decimal font-semibold">
          {cart && Object.keys(cart).length === 0 && (
            <div className="my-4 font-semibold">Your cart is empty</div>
          )}

          {cart && Object.keys(cart).map((k) => (
            <li key={k}>
              <div className="item flex justify-between items-center my-3">
                <div className="w-2/3 font-semibold">{cart[k].name}</div>
                <div className="flex items-center w-1/3 justify-end text-lg">
                  <FaCircleMinus
                    onClick={() => removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant)}
                    className="cursor-pointer text-pink-500"
                  />
                  <span className="mx-2 text-sm">{cart[k].qty}</span>
                  <FaCirclePlus
                    onClick={() => addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant)}
                    className="cursor-pointer text-pink-500"
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="font-bold my-4">Subtotal: Rs{subTotal}</div>
        <div className="flex gap-2">
          <button
            onClick={handleCheckout}
            className="flex items-center text-white bg-pink-500 hover:bg-pink-600 border-0 py-2 px-3 rounded text-sm"
          >
            <IoBagCheckSharp className="mr-1" />
            Pay Now
          </button>
          <button
            onClick={clearCart}
            className="flex text-white bg-pink-500 border-0 py-2 px-3 hover:bg-pink-600 rounded text-sm"
          >
            Clear Cart
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Checkout;
