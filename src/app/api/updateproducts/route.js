import Product from "../../../models/Product";
import connectDb from "../../../middleware/mongoose";

export const POST = async (req) => {
  await connectDb();  // connect to DB first

  try {
    const products = await req.json();
    console.log(products);

    if (!Array.isArray(products)) {
      return new Response(JSON.stringify({ error: "Request body must be an array of products" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    for (const product of products) {
      if (!product._id) {
        console.warn("Skipping product without _id:", product);
        continue;
      }

      await Product.findByIdAndUpdate(
        product._id,
        {
          title: product.title,
          slug: product.slug,
          desc: product.desc,
          img: product.img,
          category: product.category,
          size: product.size,
          color: product.color,
          price: product.price,
          availableQty: product.availableQty,
        },
        { new: true } // optional: return updated doc
      );
    }

    return new Response(JSON.stringify({ success: "Products updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating products:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
