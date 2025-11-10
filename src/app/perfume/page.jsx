// import Link from "next/link";
// import Product from "@/models/Product";
// import mongoose from "mongoose";

// export default async function Page() {
//   if (mongoose.connections[0].readyState !== 1) {
//     await mongoose.connect(process.env.MONGO_URI);
//   }

//   let products = await Product.find({ category: "perfumes" }).lean();

//   let groupedProducts = {};

//   for (let item of products) {
//     if (item.title in groupedProducts) {
//       if (item.availableQty > 0 && !groupedProducts[item.title].sizes.includes(item.size)) {
//         groupedProducts[item.title].sizes.push(item.size);
//       }
//       if (!groupedProducts[item.title].colors.includes(item.color)) {
//         groupedProducts[item.title].colors.push(item.color);
//       }
//     } else {
//       groupedProducts[item.title] = {
//         title: item.title,
//         slug: item.slug,
//         img: item.img,
//         category: item.category,
//         price: item.price,
//         sizes: item.availableQty > 0 && item.size ? [item.size] : [],
//         colors: item.color ? [item.color] : [],
//       };
//     }
//   }

//   return (
//     <div>
//       <section className="text-gray-600 body-font">
//         <div className="container px-5 py-24 mx-auto">
//           <h1 className="text-3xl font-bold mb-10 text-center">Perfumes</h1>
//           <div className="flex flex-wrap justify-center">
//             {Object.values(groupedProducts).map((product) => (
//               <Link
//                 key={product.slug}
//                 href={`/product/${product.slug}`}
//                 className="lg:w-1/4 md:w-1/2 p-4 w-full shadow-lg"
//               >
//                 <div className="block relative rounded overflow-hidden">
//                   <img
//                     alt={product.title}
//                     className="m-auto h-[30vh] md:h-[46vh] block"
//                     src={product.img}
//                   />
//                 </div>
//                 <div className="mt-4 text-center md:text-left">
//                   <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
//                     {product.category}
//                   </h3>
//                   <h2 className="text-gray-900 title-font text-lg font-medium">
//                     {product.title}
//                   </h2>
//                   <p className="mt-1">Rs {product.price}</p>

//                   {product.sizes.length > 0 && (
//                     <div className="mt-1 flex flex-wrap justify-center md:justify-start gap-1">
//                       {product.sizes.map((size) => (
//                         <span
//                           key={size}
//                           className="border border-gray-400 px-2 py-0.5 rounded text-xs font-medium"
//                         >
//                           {size}
//                         </span>
//                       ))}
//                     </div>
//                   )}

//                   <div className="mt-1 flex justify-center md:justify-start">
//                     {product.colors.map((col) => (
//                       <button
//                         key={col}
//                         className="border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none"
//                         style={{ backgroundColor: col }}
//                       ></button>
//                     ))}
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


import Link from "next/link";
import Product from "@/models/Product";
import connectDB from "@/lib/connectDB";

// Disable static generation
export const revalidate = 0;

export default async function PerfumePage() {
  await connectDB();

  const products = await Product.find({ category: "perfumes" }).lean();

  // Group by title
  const groupedProducts = {};
  products.forEach((item) => {
    if (groupedProducts[item.title]) {
      if (item.availableQty > 0 && !groupedProducts[item.title].sizes.includes(item.size)) {
        groupedProducts[item.title].sizes.push(item.size);
      }
      if (!groupedProducts[item.title].colors.includes(item.color)) {
        groupedProducts[item.title].colors.push(item.color);
      }
    } else {
      groupedProducts[item.title] = {
        title: item.title,
        slug: item.slug,
        img: item.img,
        category: item.category,
        price: item.price,
        sizes: item.availableQty > 0 && item.size ? [item.size] : [],
        colors: item.color ? [item.color] : [],
      };
    }
  });

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <h1 className="text-3xl font-bold mb-10 text-center">Perfumes</h1>
          <div className="flex flex-wrap justify-center">
            {Object.values(groupedProducts).map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="lg:w-1/4 md:w-1/2 p-4 w-full shadow-lg hover:shadow-2xl transition-shadow rounded"
              >
                <div className="block relative rounded overflow-hidden">
                  <img
                    alt={product.title}
                    className="m-auto h-[30vh] md:h-[46vh] object-cover block"
                    src={product.img}
                  />
                </div>
                <div className="mt-4 text-center md:text-left">
                  <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                    {product.category}
                  </h3>
                  <h2 className="text-gray-900 title-font text-lg font-medium">
                    {product.title}
                  </h2>
                  <p className="mt-1">Rs {product.price}</p>

                  {product.sizes.length > 0 && (
                    <div className="mt-1 flex flex-wrap justify-center md:justify-start gap-1">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="border border-gray-400 px-2 py-0.5 rounded text-xs font-medium"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 flex justify-center md:justify-start">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        className="border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none"
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
