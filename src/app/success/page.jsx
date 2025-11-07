"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  Share2,
  Repeat,
  Mail,
  Moon,
  Sun,
  Copy,
} from "lucide-react";
import Confetti from "react-confetti";
import { useReducedMotion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Page() {
  // UI state
  const [showConfetti, setShowConfetti] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const reduceMotion = useReducedMotion();
  const receiptRef = useRef(null);

  // Simulated order data
  const order = {
    id: `ORD-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    date: new Date().toLocaleString(),
    items: [
      { name: "Classic Tee", qty: 2, price: 24.99 },
      { name: "Blue Hoodie", qty: 1, price: 49.0 },
    ],
    total: 98.0,
    email: "customer@example.com",
  };

  // Set client dims and show confetti pulse
  useEffect(() => {
    const setWindowDims = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    setWindowDims();
    window.addEventListener("resize", setWindowDims);

    if (!reduceMotion) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 4200);
      return () => {
        clearTimeout(t);
        window.removeEventListener("resize", setWindowDims);
      };
    }

    return () => window.removeEventListener("resize", setWindowDims);
  }, [reduceMotion]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      const target = e.target;
      const tag = target?.tagName || "";

      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key.toLowerCase()) {
        case "r":
          handleRetry();
          break;
        case "d":
          handleDownload();
          break;
        case "c":
          handleCopy();
          break;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // small toast helper
  function showToast(msg, ms = 2000) {
    setToast(String(msg));
    setTimeout(() => setToast(""), ms);
  }

  // Download receipt as PDF
  async function handleDownload() {
    if (!receiptRef.current) return;
    showToast("Preparing receipt...");
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${order.id}-receipt.pdf`);
      showToast("Receipt downloaded");
    } catch (err) {
      console.error(err);
      showToast("Failed to generate PDF");
    }
  }

  // Sharing: Web Share API with clipboard fallback
  async function handleShare() {
    const shareData = {
      title: "Order confirmation",
      text: `Order ${order.id} — total ${formatCurrency(order.total)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Shared");
      } catch {
        showToast("Share canceled");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(
        `${shareData.text} — ${shareData.url}`
      );
      setCopied(true);
      showToast("Order details copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Copy failed");
    }
  }

  // Copy order id
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      showToast("Order ID copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Copy failed");
    }
  }

  // Retry: navigate to /checkout
  function handleRetry() {
    showToast("Retrying checkout...");
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 600);
  }

  // Resend confirmation
  async function handleResend() {
    setResendLoading(true);
    showToast("Resending confirmation...");
    try {
      await new Promise((res) => setTimeout(res, 900));
      showToast(`Confirmation resent to ${order.email}`);
    } catch {
      showToast("Failed to resend");
    } finally {
      setResendLoading(false);
    }
  }

  function formatCurrency(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800 flex items-center justify-center p-6">
        {/* confetti */}
        {showConfetti && dims.w > 0 && dims.h > 0 && !reduceMotion && (
          <Confetti
            recycle={false}
            numberOfPieces={96}
            gravity={0.22}
            confettiSource={{ x: dims.w / 2 - 220, y: -10, w: 440, h: 40 }}
            width={dims.w}
            height={dims.h}
          />
        )}

        {/* toast */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-black/80 text-white px-4 py-2 rounded-md text-sm shadow-lg">
              {toast}
            </div>
          </div>
        )}

        <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* left card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-green-50 dark:border-slate-700 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -top-10 -left-8 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-25 pointer-events-none dark:bg-emerald-900" />
            <div className="flex flex-col items-center gap-4">
              <div className="bg-green-50 dark:bg-slate-800 rounded-full p-4 inline-flex drop-shadow-sm">
                <CheckCircle2 className="w-20 h-20 text-green-500 dark:text-emerald-400" />
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 text-center">
                Payment Successful 🎉
              </h1>
              <p className="text-gray-600 dark:text-slate-300 text-center">
                Thank you — your order is confirmed. A receipt has been emailed
                to{" "}
                <span className="font-medium text-gray-800 dark:text-slate-100">
                  {order.email}
                </span>
                .
              </p>

              {/* order row */}
              <div className="mt-3 flex items-center gap-2">
                <div className="text-sm text-gray-500 dark:text-slate-400">
                  Order ID
                </div>
                <div className="px-3 py-1 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm font-medium select-all">
                  {order.id}
                </div>
                <button
                  onClick={handleCopy}
                  className="ml-2 inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm hover:shadow-sm transition"
                  aria-label="Copy order id"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>

              {/* action buttons */}
              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow hover:scale-[1.03] transform transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                  aria-label="Download receipt (D)"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 text-gray-700 dark:text-slate-200 shadow-sm hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-50"
                  aria-label="Share order"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>

                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500 text-white font-semibold shadow hover:brightness-105 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                  aria-label="Retry payment (R)"
                >
                  <Repeat className="w-4 h-4" />
                  Retry
                </button>
              </div>

              {/* extra actions */}
              <div className="mt-3 flex gap-3 items-center">
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 dark:bg-slate-800 text-sm hover:shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-50"
                >
                  <Mail className="w-4 h-4" />
                  {resendLoading ? "Sending..." : "Resend Email"}
                </button>

                <button
                  onClick={() => {
                    setDark((d) => !d);
                    showToast(`Turned ${!dark ? "dark" : "light"} mode`);
                  }}
                  aria-label="Toggle dark mode"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 dark:bg-slate-800 text-sm hover:shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-50"
                >
                  {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{" "}
                  Theme
                </button>
              </div>
            </div>
          </div>

          {/* right card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-green-50 dark:border-slate-700 p-6 md:p-8">
            <div ref={receiptRef} className="text-gray-800 dark:text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Order Receipt</h3>
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    {order.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    Order ID
                  </div>
                  <div className="font-mono font-semibold">{order.id}</div>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                <ul className="py-3">
                  {order.items.map((it, i) => (
                    <li key={i} className="flex justify-between py-2">
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">
                          Qty: {it.qty}
                        </div>
                      </div>
                      <div className="font-semibold">
                        {formatCurrency(it.price * it.qty)}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="py-3 flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    Total
                  </div>
                  <div className="text-lg font-bold">
                    {formatCurrency(order.total)}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600 dark:text-slate-300">
                Shipping to: <span className="font-medium">123 Main St, Your City</span>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Thank you for shopping with us — contact support for questions.
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500 dark:text-slate-400">
              Tip: press{" "}
              <kbd className="px-2 py-0.5 bg-gray-100 rounded">D</kbd> to download,{" "}
              <kbd className="px-2 py-0.5 bg-gray-100 rounded">C</kbd> to copy
              order id.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
