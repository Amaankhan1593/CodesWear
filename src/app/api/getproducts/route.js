import Product from "../../../models/Product";
import connectDb from "../../../middleware/mongoose"; // ✅ If it's a default export, no {}

export async function GET() {
  try {
    await connectDb();
    const products = await Product.find();
    
    let tshirts = {};
    for (let item of products) {
      const { title, color, size, availableQty } = item;
      if (!tshirts[title]) {
        tshirts[title] = JSON.parse(JSON.stringify(item));
        tshirts[title].color = availableQty > 0 ? [color] : [];
        tshirts[title].size = availableQty > 0 ? [size] : [];
      } else if (availableQty > 0) {
        if (!tshirts[title].color.includes(color)) {
          tshirts[title].color.push(color);
        }
        if (!tshirts[title].size.includes(size)) {
          tshirts[title].size.push(size);
        }
      }
    }

    return new Response(JSON.stringify({ tshirts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}










// // Named export for GET
// export async function GET(request) {
//   try {
//     await connectDb(); // Ensure DB connection is established

//     const products = await Product.find(); // Fetch products from MongoDB

//     return new Response(JSON.stringify({ products }), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// }
