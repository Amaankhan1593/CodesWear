import mongoose from 'mongoose';
import Product from '@/models/Product';
import ProductClient from './ProductClient';

export default async function Page({ params }) {
  const slug = decodeURIComponent(params.slug);

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const product = await Product.findOne({ slug }).lean();

  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  const variants = await Product.find({ title: product.title }).lean();

  const colorSizeSlug = {};
  for (let item of variants) {
    if (!colorSizeSlug[item.color]) {
      colorSizeSlug[item.color] = {};
    }
    colorSizeSlug[item.color][item.size] = { slug: item.slug };
  }

  return (
    <ProductClient
      product={JSON.parse(JSON.stringify(product))}
      variants={JSON.parse(JSON.stringify(colorSizeSlug))}
    />
  );
}
























// // src/app/product/[slug]/page.jsx
// 'use client';

// import { useState, useContext } from 'react';
// import mongoose from 'mongoose';
// import Product from '@/models/Product';
// import { CartContext } from '@/components/CartProvider';

// export default async function Page({ params }) {
//   // Connect to DB if needed
//   if (mongoose.connection.readyState !== 1) {
//     await mongoose.connect(process.env.MONGO_URI);
//   }

//   // Fetch product by slug
//   let product = await Product.findOne({ slug: params.slug }).lean();

//   // Fetch variants with same title
//   let variants = await Product.find({ title: product.title }).lean();

//   // Build color-size-slug map
//   let colorSizeSlug = {};
//   for (let item of variants) {
//     if (colorSizeSlug[item.color]) {
//       colorSizeSlug[item.color][item.size] = { slug: item.slug };
//     } else {
//       colorSizeSlug[item.color] = { [item.size]: { slug: item.slug } };
//     }
//   }

//   return (
//     <ProductClient
//       product={JSON.parse(JSON.stringify(product))}
//       variants={JSON.parse(JSON.stringify(colorSizeSlug))}
//     />
//   );
// }

// // 🧩 Client component for interactivity
// function ProductClient({ product, variants }) {
//   const { addToCart } = useContext(CartContext);
//   const [pin, setPin] = useState('');
//   const [service, setService] = useState(null);
//   const [selectedColor, setSelectedColor] = useState(Object.keys(variants)[0]);
//   const [selectedSize, setSelectedSize] = useState(
//     Object.keys(variants[selectedColor])[0]
//   );

//   const checkServiceability = async () => {
//     let res = await fetch('/api/pincode');
//     let data = await res.json();
//     if (data.serviceablePincodes.includes(parseInt(pin))) {
//       setService(true);
//     } else {
//       setService(false);
//     }
//   };

//   const onChangePin = (e) => setPin(e.target.value);

//   // When user selects a color, default to first available size
//   const handleColorChange = (color) => {
//     setSelectedColor(color);
//     setSelectedSize(Object.keys(variants[color])[0]);
//   };

//   return (
//     <section className="text-gray-600 body-font overflow-hidden">
//       <div className="container px-5 py-16 mx-auto">
//         <div className="lg:w-4/5 mx-auto flex flex-wrap">
//           <img
//             alt={product.title}
//             className="lg:w-1/2 w-full lg:h-auto px-24 object-cover object-top rounded"
//             src={product.img}
//           />
//           <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
//             <h2 className="text-sm title-font text-gray-500 tracking-widest">CODESWEAR</h2>
//             <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
//               {product.title} ({selectedSize}/{selectedColor})
//             </h1>

//             <p className="leading-relaxed">{product.desc}</p>

//             <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
//               <div className="flex">
//                 <span className="mr-3">Color</span>
//                 {Object.keys(variants).map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => handleColorChange(color)}
//                     className={`border-2 ml-1 rounded-full w-6 h-6 focus:outline-none ${
//                       color.toLowerCase() === selectedColor.toLowerCase()
//                         ? 'border-pink-500'
//                         : 'border-gray-300'
//                     }`}
//                     style={{ backgroundColor: color }}
//                   ></button>
//                 ))}
//               </div>

//               <div className="flex ml-6 items-center">
//                 <span className="mr-3">Size</span>
//                 <div className="relative">
//                   <select
//                     value={selectedSize}
//                     onChange={(e) => setSelectedSize(e.target.value)}
//                     className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-base pl-3 pr-10"
//                   >
//                     {Object.keys(variants[selectedColor]).map((size) => (
//                       <option key={size}>{size}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="flex">
//               <span className="title-font font-medium text-2xl text-gray-900">
//                 Rs{product.price}
//               </span>
//               <button className="flex ml-4 text-white bg-pink-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-pink-600 rounded">
//                 Buy Now
//               </button>
//               <button
//                 onClick={() =>
//                   addToCart(
//                     variants[selectedColor][selectedSize].slug,
//                     1,
//                     product.price,
//                     `${product.title} (${selectedSize}, ${selectedColor})`,
//                     selectedSize,
//                     selectedColor
//                   )
//                 }
//                 className="flex ml-4 text-white bg-pink-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-pink-600 rounded"
//               >
//                 Add to cart
//               </button>
//             </div>

//             <div className="pin mt-6 flex space-x-2 text-sm">
//               <input
//                 onChange={onChangePin}
//                 className="px-2 border-2 border-gray-400 rounded-md"
//                 placeholder="Enter Your Pincode"
//                 type="text"
//               />
//               <button
//                 onClick={checkServiceability}
//                 className="text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded"
//               >
//                 Check
//               </button>
//             </div>

//             {service === false && (
//               <div className="text-red-700 text-sm mt-3">
//                 Sorry! We do not deliver at this pincode yet
//               </div>
//             )}
//             {service === true && (
//               <div className="text-green-700 text-sm mt-3">
//                 Yay! This pincode is serviceable
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }




























































// 'use client';

// import { useParams } from 'next/navigation';
// import { useState, useContext } from 'react';
// import { CartContext } from '@/components/CartProvider';
// import mongoose from 'mongoose';
// import Product from '@/models/Product';

// export default function Page() {
//   const { addToCart } = useContext(CartContext);

//   const params = useParams();
//   const slug = params.slug;
//   const [pin, setPin] = useState('');
//   const [service, setService] = useState(null);

//   const checkServiceability = async()=>{
//    let pins = await fetch('http://localhost:3000/api/pincode');
// let pinJson = await pins.json();

// console.log(pin, pinJson); // Check what you got

// if (pinJson.serviceablePincodes.includes(parseInt(pin))) {
//   setService(true);
// } else {
//   setService(false);
// }

//   }

//   const onChangePin = (e)=>{
//      setPin(e.target.value) 
//   }

//   return <>
//   <section className="text-gray-600 body-font overflow-hidden">
//   <div className="container px-5 py-16 mx-auto">
//     <div className="lg:w-4/5 mx-auto flex flex-wrap">
//       <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto px-24 object-cover object-top rounded" src="https://outfitters.com.pk/cdn/shop/files/F1474106814_4.jpg?v=1742966967"/>
//       <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
//         <h2 className="text-sm title-font text-gray-500 tracking-widest">CODESWEAR</h2>
//         <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">Wear the code (XL/Blue)</h1>
//         <div className="flex mb-4">
//           <span className="flex items-center">
//             <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
//             </svg>
//             <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
//             </svg>
//             <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
//             </svg>
//             <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
//             </svg>
//             <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
//             </svg>
//             <span className="text-gray-600 ml-3">4 Reviews</span>
//           </span>
//           <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
//             <a className="text-gray-500">
//               <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
//                 <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
//               </svg>
//             </a>
//             <a className="text-gray-500">
//               <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
//                 <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
//               </svg>
//             </a>
//             <a className="text-gray-500">
//               <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
//                 <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
//               </svg>
//             </a>
//           </span>
//         </div>
//         <p className="leading-relaxed">Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo tattooed umami cardigan.</p>
//         <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
//           <div className="flex">
//             <span className="mr-3">Color</span>
//             <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
//             <button className="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
//             <button className="border-2 border-gray-300 ml-1 bg-pink-500 rounded-full w-6 h-6 focus:outline-none"></button>
//           </div>
//           <div className="flex ml-6 items-center">
//             <span className="mr-3">Size</span>
//             <div className="relative">
//               <select className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-base pl-3 pr-10">
//                 <option>SM</option>
//                 <option>M</option>
//                 <option>L</option>
//                 <option>XL</option>
//               </select>
//               <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
//                 <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
//                   <path d="M6 9l6 6 6-6"></path>
//                 </svg>
//               </span>
//             </div>
//           </div>
//         </div>
//         <div className="flex">
//           <span className="title-font font-medium text-2xl text-gray-900">Rs599</span>
//           <button className="flex ml-4 text-white bg-pink-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-pink-600 rounded">Buy Now</button>
//           <button onClick={()=>{addToCart(slug, 1, 599, 'wear the code(XL, RED)', 'XL', "Red")}} className="flex ml-4 text-white bg-pink-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-pink-600 rounded">Add to cart</button>
//           <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
//             <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
//               <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
//             </svg>
//           </button>
//         </div>
//         <div className="pin mt-6 flex space-x-2 text=sm">
//           <input onChange={onChangePin} className="px-2 border-2 border-gray-400 rounded-md" placeholder='Enter Your Pincode' type="text" />
//           <button onClick={checkServiceability}className="text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">Check</button>
//         </div>
//         {(!service && service !=null) && <div className="text-red-700 text-sm mt-3">
//           Sorry! We do not deliver at this pincode yet
//         </div>}

//         {(service && service !=null) && <div className="text-green-700 text-sm mt-3">
//           Yay! This pincode is serviceable
//         </div>}
//       </div>
//     </div>
//   </div>
// </section>
//   </>
// }

// export async function getServerSideProps(context){
//    if (!mongoose.connection[0].readyState) {
//        await mongoose.connect(process.env.MONGO_URI)
//    }
//      let product = await Product.findOne({ slug: context.query.slug })
//      let variants = await Product.find({title: product.title})
//      let colorSizeSlug = {}
//      for (let item of variants ){
//       if (Object.keys(colorSizeSlug).includes(item.color)) {
//         colorSizeSlug[item.color][item.size] = {slug: item.slug}
//       }
//       else{
//         colorSizeSlug[item.color] = {}
//        colorSizeSlug[item.color][item.size] = {slug: item.slug}
//       }
//      }

//      return{
//       props: { product: JSON.parse(JSON.stringify(product)), variants: JSON.parse(JSON.stringify(colorSizeSlug)) }
//      }
// }

// export default Post