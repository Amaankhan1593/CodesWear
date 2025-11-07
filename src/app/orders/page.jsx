'use client';
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Clock,
  Truck,
  Repeat,
  MapPin,
  X,
  Eye,
  Star,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';

// sample orders (UI-only) with images
const orders = [
  {
    id: 'ORD-1029',
    productName: 'Red Sneakers',
    color: 'Red',
    category: 'Shoes',
    price: 79.99,
    date: '2025-08-26',
    status: 'Delivered',
    rating: 4.5,
    img: 'data:image/jpeg;base64,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',
    qty: 1,
    notes: 'Delivered to front door. Gift wrap: no.',
  },
  {
    id: 'ORD-1098',
    productName: 'Blue Hoodie',
    color: 'Blue',
    category: 'Clothing',
    price: 49.99,
    date: '2025-08-30',
    status: 'Shipped',
    rating: 4.0,
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGCl5-El1Jlv_LrR5R8rGYFttQLf2Ubt1SUw&s',
    qty: 1,
    notes: 'Handle with care.',
  },
  {
    id: 'ORD-1134',
    productName: 'Smart Watch',
    color: 'Black',
    category: 'Accessories',
    price: 199.99,
    date: '2025-09-01',
    status: 'Pending',
    rating: 0,
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8a6d5b1b2c3a4d5e6f7b8c9d0a1b2c3d',
    qty: 1,
    notes: 'Customer requested express shipping.',
  },
  {
    id: 'ORD-1001',
    productName: 'Leather Wallet',
    color: 'Brown',
    category: 'Accessories',
    price: 39.99,
    date: '2025-07-15',
    status: 'Delivered',
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=993c8f74a1b2b3c4d5e6f7a8b9c0d1e2',
    qty: 2,
    notes: '',
  },
  {
    id: 'ORD-1044',
    productName: 'Sunglasses',
    color: 'Black',
    category: 'Accessories',
    price: 89.99,
    date: '2025-08-05',
    status: 'Shipped',
    rating: 4.2,
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=b8f8b9c7c6d5e4f3a2b1c0d9e8f7a6b5',
    qty: 1,
    notes: 'Include invoice in package.',
  },
];

// map status to styles and icon
const statusMap = {
  Pending: { cls: 'bg-yellow-100 text-yellow-800 ring-yellow-200', icon: <Clock size={14} /> },
  Shipped: { cls: 'bg-sky-100 text-sky-800 ring-sky-200', icon: <Truck size={14} /> },
  Delivered: { cls: 'bg-green-100 text-green-800 ring-green-200', icon: <Package size={14} /> },
  Default: { cls: 'bg-gray-100 text-gray-800 ring-gray-200', icon: <Clock size={14} /> },
};

function StatusBadge({ status }) {
  const info = statusMap[status] || statusMap.Default;
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ring-1 ${info.cls}`}
      aria-hidden
    >
      {info.icon}
      <span>{status}</span>
    </span>
  );
}

function Stars({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1 text-yellow-400 text-sm">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        if (idx <= full) return <span key={i}>★</span>;
        if (half && idx === full + 1) return <span key={i}>☆</span>;
        return <span key={i} className="text-gray-200">★</span>;
      })}
      <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">{rating ? rating.toFixed(1) : '—'}</span>
    </div>
  );
}

export default function OrdersPage() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== 'All' && o.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        o.productName.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  function showToast(msg = '') {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  // cart helpers (UI-only)
  function addToCart(order) {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.id === order.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { id: order.id, productName: order.productName, price: order.price, qty: 1, img: order.img }];
    });
    showToast('Added to cart (UI)');
    setCartOpen(true);
  }

  function incQty(id) {
    setCartItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p)));
  }
  function decQty(id) {
    setCartItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p))
        .filter(Boolean)
    );
  }
  function removeFromCart(id) {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  }

  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.qty, 0), [cartItems]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-6">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -left-20 -top-16 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300 to-cyan-200 opacity-25 blur-3xl transform rotate-12" />
      <div className="pointer-events-none absolute right-8 top-28 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-300 to-blue-200 opacity-18 blur-2xl" />

      {/* header */}
      <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between gap-4">
        <div className="text-center w-full md:w-auto md:text-left">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm">My Orders</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
            A rich, UI-only experience — filter, search, and view beautiful order details.
          </p>
        </div>

        {/* cart button (large) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-2xl hover:scale-105 transition transform"
            title="Open cart"
            aria-label="Open cart"
          >
            <ShoppingCart size={26} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-red-500 text-white shadow-lg">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* controls */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex bg-white/60 dark:bg-gray-800/50 backdrop-blur rounded-full p-1 gap-1 shadow-sm">
            {['All', 'Pending', 'Shipped', 'Delivered'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                  filter === f
                    ? 'bg-white shadow-md text-blue-700 dark:bg-gray-700/60 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="relative flex items-center w-full md:w-72">
            <Search size={16} className="absolute left-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders, items or id..."
              className="pl-10 pr-3 py-2 rounded-full w-full md:w-72 bg-white/80 dark:bg-gray-800/60 backdrop-blur placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
            />
          </label>

          <div className="ml-auto md:ml-0">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/40 dark:bg-gray-800/40 shadow-sm text-sm">
              <MapPin size={14} /> Free shipping over $50
            </div>
          </div>
        </div>
      </div>

      {/* cards */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((o, idx) => (
          <motion.article
            key={o.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.03, y: -6, rotate: -0.5 }}
            className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/40 dark:border-gray-700/40 rounded-3xl p-4 shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col"
          >
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                <img src={o.img} alt={o.productName} className="w-full h-full object-cover" />
              </div>

              {/* content area: allow shrinking/truncation */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {o.productName}
                    </h3>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 truncate">
                      <span className="font-medium">{o.category}</span> • {o.color}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusBadge status={o.status} />
                    <div className="text-xs text-gray-500 dark:text-gray-400">{o.date}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-lg shadow-sm">
                      ${o.price.toFixed(2)}
                    </span>
                    <div className="ml-2">
                      <Stars rating={o.rating} />
                    </div>
                  </div>

                  {/* buttons container: allow wrapping on small screens so they don't overlap */}
                  <div className="flex flex-wrap gap-2 items-center justify-end">
                    <button
                      onClick={() => setSelected(o)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition flex-none"
                      title="View details"
                    >
                      <Eye size={14} /> View
                    </button>

                    <button
                      onClick={() => showToast('Tracking opened (UI)')}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/40 dark:border-gray-600/40 bg-white/20 dark:bg-gray-700/30 text-gray-800 dark:text-gray-100 hover:backdrop-brightness-105 transition flex-none"
                      title="Track"
                    >
                      <Truck size={14} /> Track
                    </button>
                  </div>
                </div>

                {/* Add to Cart row */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Qty: 1</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(o)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-600 text-white font-semibold shadow hover:from-cyan-500 hover:to-sky-700 transition flex-none"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-600 dark:text-gray-300">
            No orders match your filter/search.
          </div>
        )}
      </main>

      {/* modal (UI-only) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative max-w-3xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 ring-1 ring-white/20"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 p-2 rounded-full bg-white/30 dark:bg-gray-800/40 hover:bg-white/50 transition"
                aria-label="close"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-md">
                  <img src={selected.img} alt={selected.productName} className="w-full h-64 object-cover" />
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selected.productName}</h2>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {selected.category} • {selected.color} • Qty: {selected.qty}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-lg shadow-sm">
                      ${selected.price.toFixed(2)}
                    </span>
                    <StatusBadge status={selected.status} />
                    <Stars rating={selected.rating} />
                  </div>

                  <p className="mt-4 text-gray-700 dark:text-gray-300">{selected.notes || 'No notes for this order.'}</p>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => {
                        addToCart(selected);
                        showToast('Reorder placed (UI) - added to cart');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
                    >
                      <Repeat size={16} /> Reorder
                    </button>

                    <button
                      onClick={() => showToast('Opened tracking (UI)')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/40 dark:border-gray-600/40 bg-white/20 dark:bg-gray-700/30 text-gray-800 dark:text-gray-100 hover:backdrop-brightness-105 transition"
                    >
                      <Truck size={16} /> Track
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* cart drawer (large width & height) */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            key="cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative ml-auto bg-white dark:bg-gray-900 rounded-tl-2xl rounded-bl-2xl shadow-2xl w-[560px] h-[90vh] max-h-[calc(100vh-40px)] m-6 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} />
                  <h3 className="text-lg font-semibold">Your Cart</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">{cartItems.length} items</div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-2 rounded-full bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 transition"
                    aria-label="close cart"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto h-[calc(90vh-200px)] space-y-4">
                {cartItems.length === 0 && (
                  <div className="text-center text-gray-600 dark:text-gray-300 py-20">
                    Your cart is empty.
                  </div>
                )}

                {cartItems.map((it) => (
                  <div key={it.id} className="flex items-center gap-4 bg-white/50 dark:bg-gray-800/40 p-3 rounded-xl shadow-sm">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={it.img} alt={it.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white truncate">{it.productName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">ID: {it.id}</div>
                        </div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-100">${(it.price * it.qty).toFixed(2)}</div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="inline-flex items-center border rounded-xl overflow-hidden">
                          <button
                            onClick={() => decQty(it.id)}
                            className="px-3 py-2 hover:bg-white/30 transition"
                            aria-label="decrease"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="px-4 py-2 bg-white/20 text-sm">{it.qty}</div>
                          <button
                            onClick={() => incQty(it.id)}
                            className="px-3 py-2 hover:bg-white/30 transition"
                            aria-label="increase"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(it.id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                          aria-label="remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">Subtotal</div>
                  <div className="text-lg font-bold">${subtotal.toFixed(2)}</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => showToast('Checkout (UI)')}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={() => {
                      setCartItems([]);
                      showToast('Cart cleared (UI)');
                    }}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="fixed right-6 bottom-6 z-50"
          >
            <div className="bg-white rounded-xl px-4 py-2 shadow-lg text-sm font-medium">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* footer */}
      <footer className="max-w-6xl mx-auto text-center mt-12 text-sm text-gray-600 dark:text-gray-400">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/40 shadow-sm">
          <MapPin size={14} /> Free standard shipping on orders over $50
        </div>
      </footer>
    </div>
  );
}
