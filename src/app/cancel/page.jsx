"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { XCircle, ShoppingCart, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-rose-200 p-6">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl text-center relative"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <XCircle className="w-20 h-20 text-rose-500" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          It looks like your payment didn’t go through. Don’t worry — your cart is still saved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <button
            onClick={() => router.push("/checkout")}
            className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
          >
            <RefreshCw className="w-5 h-5" /> Try Again
          </button>

          <button
            onClick={() => router.push("/cart")}
            className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition"
          >
            <ShoppingCart className="w-5 h-5" /> Back to Cart
          </button>
        </div>

        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-sm text-rose-500 hover:underline"
        >
          {showHelp ? "Hide Help" : "Need Help?"}
        </button>

        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-4 border rounded-lg bg-rose-50 text-left text-sm text-gray-700"
          >
            <ul className="list-disc list-inside space-y-2">
              <li>Check if your card details are correct.</li>
              <li>Ensure you have enough balance available.</li>
              <li>Try a different payment method.</li>
              <li>If the issue persists, contact our support team.</li>
            </ul>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}