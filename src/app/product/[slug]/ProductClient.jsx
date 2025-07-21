'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/components/CartProvider';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductClient({ product, variants }) {
  const router = useRouter();
  const { addToCart, clearCart } = useContext(CartContext);

  const [pin, setPin] = useState('');
  const [service, setService] = useState(null);
  const [selectedColor, setSelectedColor] = useState(Object.keys(variants)[0]);
  const [selectedSize, setSelectedSize] = useState(Object.keys(variants[selectedColor])[0]);

  const checkServiceability = async () => {
    if (!pin || pin.length < 5) {
      toast.error('❗ Please enter a valid 5-digit pincode', {
        position: 'bottom-center',
        autoClose: 3000,
        transition: Bounce,
      })
      return;
    }

    try {
      const res = await fetch('/api/pincode');
      const data = await res.json();
      const isServiceable = data.serviceablePincodes.includes(parseInt(pin));
      setService(isServiceable);

      if (isServiceable) {
        toast.success('Your Pincode is Serviceable', {
          position: 'bottom-center',
          autoClose: 3000,
          transition: Bounce,
        });
      } else {
        toast.error('❌ Sorry! We do not deliver to this pincode', {
          position: 'bottom-center',
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error('⚠️ Failed to check serviceability. Try again.', {
        position: 'bottom-center',
        autoClose: 3000,
        transition: Bounce,
      });
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(Object.keys(variants[color])[0]);
  };

  const buyNow = () => {
    clearCart();
    const slug = variants[selectedColor][selectedSize].slug;
    addToCart(
      slug,
      1,
      product.price,
      `${product.title} (${selectedSize}, ${selectedColor})`,
      selectedSize,
      selectedColor
    );
    router.push('/checkout');
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <ToastContainer />
      <div className="container px-5 py-16 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            alt={`${product.title} in ${selectedColor}`}
            className="lg:w-1/2 w-full lg:h-auto px-24 object-cover object-top rounded"
            src={product.img}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">CODESWEAR</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {product.title} ({selectedSize}/{selectedColor})
            </h1>
            <p className="leading-relaxed">{product.desc}</p>

            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex">
                <span className="mr-3">Color</span>
                {Object.keys(variants).map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`border-2 ml-1 rounded-full w-6 h-6 focus:outline-none ${
                      color === selectedColor ? 'border-pink-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  ></button>
                ))}
              </div>

              <div className="flex ml-6 items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="rounded border border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
                  >
                    {Object.keys(variants[selectedColor]).map((size) => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">
                Rs{product.price}
              </span>
              <button
                onClick={buyNow}
                className="flex ml-4 text-white bg-pink-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-pink-600 rounded"
              >
                Buy Now
              </button>
              <button
                onClick={() =>
                  addToCart(
                    variants[selectedColor][selectedSize].slug,
                    1,
                    product.price,
                    `${product.title} (${selectedSize}, ${selectedColor})`,
                    selectedSize,
                    selectedColor
                  )
                }
                className="flex ml-4 text-white bg-pink-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-pink-600 rounded"
              >
                Add to Cart
              </button>
            </div>

            <div className="pin mt-6 flex space-x-2 text-sm">
              <input
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="px-2 border-2 border-gray-400 rounded-md"
                placeholder="Enter Your Pincode"
                type="text"
                value={pin}
              />
              <button
                onClick={checkServiceability}
                className="text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded"
              >
                Check
              </button>
            </div>

            {service === false && (
              <div className="text-red-700 text-sm mt-3">
                Sorry! We do not deliver at this pincode yet
              </div>
            )}
            {service === true && (
              <div className="text-green-700 text-sm mt-3">
                Yay! This pincode is serviceable
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
