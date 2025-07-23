import mongoose from "mongoose";
import Order from "@/models/Order";

async function getOrders(){
  if (mongoose.connections[0].readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  const orders = await Order.find().lean();
  return JSON.parse(JSON.stringify(orders)); // remove MongoDB ObjectId issues
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="container text-center mx-auto">
        <div className="relative overflow-x-auto">
          <h1 className="font-bold text-xl p-8">My Orders</h1>

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Product name</th>
                <th className="px-6 py-3">Color</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {order.productName || "N/A"}
                  </td>
                  <td className="px-6 py-4">{order.color || "N/A"}</td>
                  <td className="px-6 py-4">{order.category || "N/A"}</td>
                  <td className="px-6 py-4">
                    ${order.price ? order.price.toFixed(2) : "0.00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
