import Link from "next/link";
import Product from "@/models/Product";
import mongoose from "mongoose";

export default async function Page() {
  // Connect to DB if not already connected
  if (mongoose.connections[0].readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  // Fetch all hoodie products
  let products = await Product.find({ category: "hoodies" }).lean();

  // Group products by title
  let groupedProducts = {};

  for (let item of products) {
    if (item.title in groupedProducts) {
      // Add size if not already present and qty > 0
      if (item.availableQty > 0 && !groupedProducts[item.title].sizes.includes(item.size)) {
        groupedProducts[item.title].sizes.push(item.size);
      }

      // Add color if not already present
      if (!groupedProducts[item.title].colors.includes(item.color)) {
        groupedProducts[item.title].colors.push(item.color);
      }
    } else {
      // First time seeing this product title
      groupedProducts[item.title] = {
        title: item.title,
        slug: item.slug,
        img: item.img,
        category: item.category,
        price: item.price,
        sizes: item.availableQty > 0 ? [item.size] : [],
        colors: [item.color],
      };
    }
  }

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap justify-center">
            {Object.values(groupedProducts).map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="lg:w-1/4 md:w-1/2 p-4 w-full shadow-lg"
              >
                <div className="block relative rounded overflow-hidden">
                  <img
                    alt={product.title}
                    className="m-auto h-[30vh] md:h-[46vh] block"
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

                  {/* Show all sizes available for this title */}
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

                  {/* Show all colors available */}
                  <div className="mt-1 flex justify-center md:justify-start">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        className="border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none"
                        style={{ backgroundColor: col }}
                      ></button>
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
