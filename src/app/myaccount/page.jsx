"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Package,
  Clock,
  Truck,
  Eye,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Star,
  Check,
  Bell,
} from "lucide-react";

/* ----------------------
   Sample UI-only data
   ---------------------- */
const ordersSample = [
  {
    id: "ORD-1029",
    productName: "Red Sneakers",
    color: "Red",
    category: "Shoes",
    price: 79.99,
    date: "2025-08-26",
    status: "Delivered",
    rating: 4.5,
    img: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/b7334778aa394094bfd4d08499517d06_9366/Dame_X_Shoes_Red_JP6093_01_00_standard.jpg",
  },
  {
    id: "ORD-1098",
    productName: "Blue Hoodie",
    color: "Blue",
    category: "Clothing",
    price: 49.99,
    date: "2025-08-30",
    status: "Shipped",
    rating: 4.0,
    img: "https://equatorstores.com/cdn/shop/files/FAC-H-W21-04-TEALPRO50.jpg?v=1755093990&width=600",
  },
  {
    id: "ORD-1134",
    productName: "Smart Watch",
    color: "Black",
    category: "Accessories",
    price: 199.99,
    date: "2025-09-01",
    status: "Pending",
    rating: 0,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
  },
];

const activitiesSample = [
  { id: 1, text: "Changed password", time: "2 days ago" },
  { id: 2, text: "Order ORD-1098 shipped", time: "5 days ago" },
  { id: 3, text: "Updated address", time: "2 weeks ago" },
];

const statusMap = {
  Pending: { cls: "bg-yellow-100 text-yellow-800", icon: <Clock size={14} /> },
  Shipped: { cls: "bg-sky-100 text-sky-800", icon: <Truck size={14} /> },
  Delivered: {
    cls: "bg-green-100 text-green-800",
    icon: <Package size={14} />,
  },
};

/* ----------------------
   Small subcomponents
   ---------------------- */
function StatusBadge({ status }) {
  const info = statusMap[status] || statusMap.Pending;
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${info.cls}`}
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
        return (
          <span key={i} className="text-gray-200">
            ★
          </span>
        );
      })}
    </div>
  );
}

/* CountUp: simple animated counter */
function CountUp({ to = 0, duration = 800, format = (n) => n }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    function step(now) {
      const elapsed = now - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.round(progress * to);
      setValue(current);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration]);
  return <span>{format(value)}</span>;
}

/* Confetti component (lightweight, CSS-based) */
function Confetti({ active = false }) {
  if (!active) return null;
  // generate 28 confetti pieces
  const pieces = Array.from({ length: 28 });
  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 z-[200]">
        {pieces.map((_, i) => {
          const left = Math.random() * 100;
          const size = 6 + Math.random() * 12;
          const delay = (Math.random() * 0.6).toFixed(2);
          const duration = 1.6 + Math.random() * 1.2;
          const colors = [
            "#60A5FA",
            "#06B6D4",
            "#7C3AED",
            "#34D399",
            "#F97316",
          ];
          const color = colors[i % colors.length];
          const rotate = Math.random() * 360;
          return (
            <div
              key={i}
              style={{
                left: `${left}%`,
                width: size,
                height: size * 1.6,
                background: color,
                transform: `rotate(${rotate}deg)`,
                animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
                borderRadius: 2,
                opacity: 0.95,
                position: "absolute",
              }}
            />
          );
        })}
      </div>
    </>
  );
}

/* ----------------------
   Main Page Component
   ---------------------- */
export default function MyAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // profile state (UI-only) with persistence
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem("ui_profile");
      return raw
        ? JSON.parse(raw)
        : {
            name: "Amaan Khan",
            email: "amaan@example.com",
            address: "Karachi, Pakistan",
            joined: "2024-01-01",
            avatar: "",
          };
    } catch {
      return {
        name: "Amaan Khan",
        email: "amaan@example.com",
        address: "Karachi, Pakistan",
        joined: "2024-01-01",
        avatar: "",
      };
    }
  });
  const [editing, setEditing] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // modal / toast / cart state (cart persisted)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("ui_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // ensure token/redirect
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) router.push("/");
    else setLoading(false);
  }, [router]);

  // persist profile
  useEffect(() => {
    try {
      localStorage.setItem("ui_profile", JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // persist cart
  useEffect(() => {
    try {
      localStorage.setItem("ui_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  function showToast(msg = "") {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  // avatar preview (UI-only)
  const onAvatarChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProfile((p) => ({ ...p, avatar: URL.createObjectURL(f) }));
    showToast("Avatar preview updated (UI)");
  };

  // cart helpers (UI-only)
  const addToCart = (o) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === o.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].qty += 1;
        return copy;
      }
      return [
        ...prev,
        {
          id: o.id,
          productName: o.productName,
          price: o.price,
          qty: 1,
          img: o.img,
        },
      ];
    });
    setCartOpen(true);
    showToast("Added to cart (UI)");
  };
  const incQty = (id) =>
    setCart((p) => p.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const decQty = (id) =>
    setCart((p) =>
      p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
    );
  const removeFromCart = (id) => setCart((p) => p.filter((i) => i.id !== id));
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );

  // stats (animated numbers)
  const totalOrders = ordersSample.length;
  const pending = ordersSample.filter((o) => o.status === "Pending").length;
  const delivered = ordersSample.filter((o) => o.status === "Delivered").length;

  // Save profile action (UI-only) -> show confetti + toast
  const saveProfile = () => {
    setEditing(false);
    setConfetti(true);
    showToast("Profile saved (UI)");
    setTimeout(() => setConfetti(false), 2600);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-6">
      {/* Confetti */}
      <Confetti active={confetti} />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-28 -top-20 w-[440px] h-[440px] rounded-full bg-gradient-to-br from-blue-300 to-cyan-200 opacity-25 blur-3xl transform rotate-12" />
      <div className="pointer-events-none absolute right-6 top-36 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-300 to-blue-200 opacity-18 blur-2xl" />

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm">
            My Account
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
            Personal dashboard — profile, recent orders, activity and
            achievements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCartOpen(true)}
            className="relative px-4 py-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-2xl hover:scale-105 transition transform flex items-center gap-2"
            title="Open cart"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex w-6 h-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold shadow">
                {cart.length}
              </span>
            )}
          </button>

          <button
            onClick={() => showToast("Notifications (UI)")}
            className="p-3 rounded-full bg-white/40 dark:bg-gray-800/40 hover:backdrop-brightness-105 transition shadow"
            title="Notifications"
          >
            <Bell size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Profile + Achievements */}
        <section className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/40 dark:border-gray-700/40 rounded-3xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile.avatar || "https://i.pravatar.cc/150?img=12"}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarChange}
                  />
                  <Plus size={12} className="text-white" />
                </label>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {editing ? (
                      <input
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                      />
                    ) : (
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {profile.name}
                      </h2>
                    )}
                    <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {profile.email}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (editing) saveProfile();
                        else setEditing(true);
                      }}
                      className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow hover:from-blue-500 hover:to-blue-700 transition flex items-center gap-2"
                    >
                      {editing ? (
                        <>
                          <Check size={14} /> Save
                        </>
                      ) : (
                        "Edit"
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    {profile.address}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Member since {profile.joined}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-2xl p-4 shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Achievements
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-2 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full text-sm font-semibold text-indigo-700 flex items-center gap-2 shadow-sm">
                <Star size={14} /> Top buyer
              </div>
              <div className="px-3 py-2 bg-white/60 dark:bg-gray-700/50 rounded-full text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2 shadow-sm">
                <Package size={14} /> 10 orders
              </div>
              <div className="px-3 py-2 bg-gradient-to-r from-green-100 to-lime-100 rounded-full text-sm font-semibold text-green-700 flex items-center gap-2 shadow-sm">
                <Truck size={14} /> Fast shipper
              </div>
            </div>
          </motion.div>
        </section>

        {/* MIDDLE: Stats + Recent Orders */}
        <section className="lg:col-span-2 space-y-6">
          {/* Stats with animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 shadow flex flex-col items-start">
              <div className="text-sm text-gray-500">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                <CountUp to={totalOrders} duration={700} />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 shadow flex flex-col items-start">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
                <CountUp to={pending} duration={700} />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 shadow flex flex-col items-start">
              <div className="text-sm text-gray-500">Delivered</div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                <CountUp to={delivered} duration={700} />
              </div>
            </div>
          </motion.div>

          {/* Recent Orders grid */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {ordersSample.map((o, idx) => (
              <motion.article
                key={o.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-2xl p-3 flex gap-3"
              >
                <div className="w-28 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow">
                  <img
                    src={o.img}
                    alt={o.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {o.productName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {o.category} • {o.color}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={o.status} />
                      <div className="text-xs text-gray-500">{o.date}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        ${o.price.toFixed(2)}
                      </div>
                      <Stars rating={o.rating} />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center justify-end">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition flex-none"
                      >
                        <Eye size={14} /> View
                      </button>

                      <button
                        onClick={() => showToast("Tracking opened (UI)")}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/40 dark:border-gray-600/40 bg-white/20 dark:bg-gray-700/30 text-gray-800 dark:text-gray-100 transition flex-none"
                      >
                        <Truck size={14} /> Track
                      </button>

                      <button
                        onClick={() => addToCart(o)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-600 text-white font-semibold shadow transition flex-none"
                      >
                        <ShoppingCart size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* RIGHT/FOOTER: Activity feed (underneath on small screens) */}
        <section className="lg:col-span-3 mt-4">
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {activitiesSample.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/60 dark:bg-gray-700/40 flex items-center justify-center shadow-sm">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {a.text}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {a.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">UI</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Order Details Modal (UI-only) */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-w-3xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 ring-1 ring-white/20"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute right-4 top-4 p-2 rounded-full bg-white/30 dark:bg-gray-800/40 hover:bg-white/50 transition"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 rounded-lg overflow-hidden shadow">
                  <img
                    src={selectedOrder.img}
                    alt={selectedOrder.productName}
                    className="w-full h-64 object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedOrder.productName}
                  </h2>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {selectedOrder.category} • {selectedOrder.color}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-lg shadow-sm">
                      ${selectedOrder.price.toFixed(2)}
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                    <Stars rating={selectedOrder.rating} />
                  </div>

                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    This is a UI-only preview of the order details. Use the
                    buttons to simulate actions.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        addToCart(selectedOrder);
                        showToast("Reorder (UI)");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow"
                    >
                      Reorder
                    </button>
                    <button
                      onClick={() => showToast("Tracking opened (UI)")}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/40 dark:border-gray-600/40 bg-white/20 text-gray-800 dark:text-gray-100"
                    >
                      Track
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer (persisted) */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            key="cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative ml-auto bg-white dark:bg-gray-900 rounded-tl-2xl rounded-bl-2xl shadow-2xl w-[620px] h-[90vh] max-h-[calc(100vh-40px)] m-6 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} />
                  <h3 className="text-lg font-semibold">Your Cart</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    {cart.length} items
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-2 rounded-full bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto h-[calc(90vh-200px)] space-y-4">
                {cart.length === 0 && (
                  <div className="text-center text-gray-600 dark:text-gray-300 py-20">
                    Your cart is empty.
                  </div>
                )}
                {cart.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-4 bg-white/50 dark:bg-gray-800/40 p-3 rounded-xl"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={it.img}
                        alt={it.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white truncate">
                            {it.productName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            ID: {it.id}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                          ${(it.price * it.qty).toFixed(2)}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="inline-flex items-center border rounded-xl overflow-hidden">
                          <button
                            onClick={() => decQty(it.id)}
                            className="px-3 py-2 hover:bg-white/30"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="px-4 py-2 bg-white/20 text-sm">
                            {it.qty}
                          </div>
                          <button
                            onClick={() => incQty(it.id)}
                            className="px-3 py-2 hover:bg-white/30"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(it.id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">Subtotal</div>
                  <div className="text-lg font-bold">
                    ${subtotal.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => showToast("Checkout (UI)")}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={() => {
                      setCart([]);
                      showToast("Cart cleared (UI)");
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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="fixed right-6 bottom-6 z-50"
          >
            <div className="bg-white rounded-xl px-4 py-2 shadow-lg text-sm font-medium">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto text-center mt-12 text-sm text-gray-600 dark:text-gray-400">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/40 shadow-sm">
          <MapPin size={14} /> Free standard shipping on orders over $50
        </div>
      </footer>
    </div>
  );
}

// 'use client';
// import React, { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   User,
//   Mail,
//   Key,
//   MapPin,
//   Package,
//   Clock,
//   Truck,
//   Eye,
//   ShoppingCart,
//   Plus,
//   Minus,
//   X,
//   Star,
//   Check,
//   Bell,
// } from 'lucide-react';

// /* ----------------------
//    Sample UI-only data
//    ---------------------- */
// const ordersSample = [
//   {
//     id: 'ORD-1029',
//     productName: 'Red Sneakers',
//     color: 'Red',
//     category: 'Shoes',
//     price: 79.99,
//     date: '2025-08-26',
//     status: 'Delivered',
//     rating: 4.5,
//     img: 'https://images.unsplash.com/photo-1528701800487-276f2ef1d4a8?q=80&w=800',
//   },
//   {
//     id: 'ORD-1098',
//     productName: 'Blue Hoodie',
//     color: 'Blue',
//     category: 'Clothing',
//     price: 49.99,
//     date: '2025-08-30',
//     status: 'Shipped',
//     rating: 4.0,
//     img: 'https://images.unsplash.com/photo-1520975919348-6c5a1f6a2b9f?q=80&w=800',
//   },
//   {
//     id: 'ORD-1134',
//     productName: 'Smart Watch',
//     color: 'Black',
//     category: 'Accessories',
//     price: 199.99,
//     date: '2025-09-01',
//     status: 'Pending',
//     rating: 0,
//     img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
//   },
// ];

// const activitiesSample = [
//   { id: 1, text: 'Changed password', time: '2 days ago' },
//   { id: 2, text: 'Order ORD-1098 shipped', time: '5 days ago' },
//   { id: 3, text: 'Updated address', time: '2 weeks ago' },
// ];

// const statusMap = {
//   Pending: { cls: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} /> },
//   Shipped: { cls: 'bg-sky-100 text-sky-800', icon: <Truck size={14} /> },
//   Delivered: { cls: 'bg-green-100 text-green-800', icon: <Package size={14} /> },
// };

// /* ----------------------
//    Small subcomponents
//    ---------------------- */
// function StatusBadge({ status }) {
//   const info = statusMap[status] || statusMap.Pending;
//   return (
//     <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${info.cls}`}>
//       {info.icon}
//       <span>{status}</span>
//     </span>
//   );
// }

// function Stars({ rating = 0 }) {
//   const full = Math.floor(rating);
//   const half = rating - full >= 0.5;
//   return (
//     <div className="flex items-center gap-1 text-yellow-400 text-sm">
//       {Array.from({ length: 5 }).map((_, i) => {
//         const idx = i + 1;
//         if (idx <= full) return <span key={i}>★</span>;
//         if (half && idx === full + 1) return <span key={i}>☆</span>;
//         return <span key={i} className="text-gray-200">★</span>;
//       })}
//     </div>
//   );
// }

// /* ----------------------
//    Main Page Component
//    ---------------------- */
// export default function MyAccountPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   // profile state (UI-only)
//   const [profile, setProfile] = useState({
//     name: 'Amaan Khan',
//     email: 'amaan@example.com',
//     address: 'Karachi, Pakistan',
//     joined: '2024-01-01',
//     avatar: '',
//   });
//   const [editing, setEditing] = useState(false);

//   // modal / toast / cart state
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [toast, setToast] = useState('');
//   const [cartOpen, setCartOpen] = useState(false);
//   const [cart, setCart] = useState([]); // {id, productName, price, qty, img}

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/');
//     } else {
//       setLoading(false);
//     }
//   }, [router]);

//   function showToast(msg = '') {
//     setToast(msg);
//     setTimeout(() => setToast(''), 2200);
//   }

//   // avatar preview (UI-only)
//   const onAvatarChange = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setProfile((p) => ({ ...p, avatar: URL.createObjectURL(f) }));
//     showToast('Avatar preview updated (UI)');
//   };

//   // cart helpers (UI-only)
//   const addToCart = (o) => {
//     setCart((prev) => {
//       const idx = prev.findIndex((p) => p.id === o.id);
//       if (idx >= 0) {
//         const copy = [...prev];
//         copy[idx].qty += 1;
//         return copy;
//       }
//       return [...prev, { id: o.id, productName: o.productName, price: o.price, qty: 1, img: o.img }];
//     });
//     setCartOpen(true);
//     showToast('Added to cart (UI)');
//   };
//   const incQty = (id) => setCart((p) => p.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
//   const decQty = (id) => setCart((p) => p.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
//   const removeFromCart = (id) => setCart((p) => p.filter(i => i.id !== id));
//   const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

//   // stats (animated numbers could be added but simple UI values here)
//   const totalOrders = ordersSample.length;
//   const pending = ordersSample.filter(o => o.status === 'Pending').length;
//   const delivered = ordersSample.filter(o => o.status === 'Delivered').length;

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen text-gray-500">Checking authentication...</div>;
//   }

//   return (
//     <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-6">
//       {/* Decorative blobs */}
//       <div className="pointer-events-none absolute -left-28 -top-20 w-[440px] h-[440px] rounded-full bg-gradient-to-br from-blue-300 to-cyan-200 opacity-25 blur-3xl transform rotate-12" />
//       <div className="pointer-events-none absolute right-6 top-36 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-300 to-blue-200 opacity-18 blur-2xl" />

//       {/* Header */}
//       <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
//         <div>
//           <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm">My Account</h1>
//           <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
//             Personal dashboard — profile, recent orders, activity and achievements.
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setCartOpen(true)}
//             className="relative px-4 py-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-2xl hover:scale-105 transition transform flex items-center gap-2"
//             title="Open cart"
//           >
//             <ShoppingCart size={20} />
//             <span className="hidden sm:inline">Cart</span>
//             {cart.length > 0 && (
//               <span className="absolute -top-2 -right-2 inline-flex w-6 h-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold shadow">
//                 {cart.length}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={() => showToast('Notifications (UI)')}
//             className="p-3 rounded-full bg-white/40 dark:bg-gray-800/40 hover:backdrop-brightness-105 transition shadow"
//             title="Notifications"
//           >
//             <Bell size={18} />
//           </button>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* LEFT: Profile + Achievements */}
//         <section className="space-y-6">
//           {/* Profile Card */}
//           <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/40 dark:border-gray-700/40 rounded-3xl p-6 shadow-lg">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <img
//                   src={profile.avatar || 'https://i.pravatar.cc/150?img=12'}
//                   alt="avatar"
//                   className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
//                 />
//                 <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600">
//                   <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
//                   <Plus size={12} className="text-white" />
//                 </label>
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     {editing ? (
//                       <input
//                         className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                         value={profile.name}
//                         onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//                       />
//                     ) : (
//                       <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{profile.name}</h2>
//                     )}
//                     <div className="text-sm text-gray-600 dark:text-gray-300 truncate">{profile.email}</div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => {
//                         if (editing) {
//                           showToast('Profile saved (UI)');
//                         }
//                         setEditing(!editing);
//                       }}
//                       className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow hover:from-blue-500 hover:to-blue-700 transition"
//                     >
//                       {editing ? <><Check size={14} /> Save</> : 'Edit'}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
//                   <div><span className="font-medium">Address:</span> {profile.address}</div>
//                   <div className="mt-1 text-xs text-gray-500">Member since {profile.joined}</div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Achievements */}
//           <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-2xl p-4 shadow">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Achievements</h3>
//             <div className="flex flex-wrap gap-3">
//               <div className="px-3 py-2 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full text-sm font-semibold text-indigo-700 flex items-center gap-2 shadow-sm">
//                 <Star size={14} /> Top buyer
//               </div>
//               <div className="px-3 py-2 bg-white/60 dark:bg-gray-700/50 rounded-full text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2 shadow-sm">
//                 <Package size={14} /> 10 orders
//               </div>
//               <div className="px-3 py-2 bg-gradient-to-r from-green-100 to-lime-100 rounded-full text-sm font-semibold text-green-700 flex items-center gap-2 shadow-sm">
//                 <Truck size={14} /> Fast shipper
//               </div>
//             </div>
//           </motion.div>
//         </section>

//         {/* MIDDLE: Stats + Recent Orders */}
//         <section className="lg:col-span-2 space-y-6">
//           {/* Stats */}
//           <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 shadow flex flex-col items-start">
//               <div className="text-sm text-gray-500">Total Orders</div>
//               <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalOrders}</div>
//             </div>
//             <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 shadow flex flex-col items-start">
//               <div className="text-sm text-gray-500">Pending</div>
//               <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{pending}</div>
//             </div>
//             <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 shadow flex flex-col items-start">
//               <div className="text-sm text-gray-500">Delivered</div>
//               <div className="text-3xl font-bold text-green-700 dark:text-green-400">{delivered}</div>
//             </div>
//           </motion.div>

//           {/* Recent Orders grid */}
//           <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {ordersSample.map((o, idx) => (
//               <motion.article
//                 key={o.id}
//                 initial={{ opacity: 0, y: 6 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ delay: idx * 0.04 }}
//                 className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-2xl p-3 flex gap-3"
//               >
//                 <div className="w-28 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow">
//                   <img src={o.img} alt={o.productName} className="w-full h-full object-cover" />
//                 </div>

//                 <div className="flex-1 min-w-0 flex flex-col">
//                   <div className="flex items-start justify-between gap-2">
//                     <div className="min-w-0">
//                       <div className="font-semibold text-gray-900 dark:text-white truncate">{o.productName}</div>
//                       <div className="text-xs text-gray-500 dark:text-gray-300">{o.category} • {o.color}</div>
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                       <StatusBadge status={o.status} />
//                       <div className="text-xs text-gray-500">{o.date}</div>
//                     </div>
//                   </div>

//                   <div className="mt-3 flex items-center justify-between gap-3">
//                     <div className="flex items-center gap-3">
//                       <div className="text-lg font-bold text-blue-700 dark:text-blue-300">${o.price.toFixed(2)}</div>
//                       <Stars rating={o.rating} />
//                     </div>

//                     <div className="flex flex-wrap gap-2 items-center justify-end">
//                       <button
//                         onClick={() => setSelectedOrder(o)}
//                         className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition flex-none"
//                       >
//                         <Eye size={14} /> View
//                       </button>

//                       <button
//                         onClick={() => showToast('Tracking opened (UI)')}
//                         className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/40 dark:border-gray-600/40 bg-white/20 dark:bg-gray-700/30 text-gray-800 dark:text-gray-100 transition flex-none"
//                       >
//                         <Truck size={14} /> Track
//                       </button>

//                       <button
//                         onClick={() => addToCart(o)}
//                         className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-600 text-white font-semibold shadow transition flex-none"
//                       >
//                         <ShoppingCart size={14} /> Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.article>
//             ))}
//           </motion.div>
//         </section>

//         {/* RIGHT/FOOTER: Activity feed (underneath on small screens) */}
//         <section className="lg:col-span-3 mt-4">
//           <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 shadow">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h3>
//             <div className="space-y-3">
//               {activitiesSample.map(a => (
//                 <div key={a.id} className="flex items-center justify-between gap-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-lg bg-white/60 dark:bg-gray-700/40 flex items-center justify-center shadow-sm">
//                       <Check size={16} className="text-green-600" />
//                     </div>
//                     <div>
//                       <div className="text-sm font-medium text-gray-900 dark:text-white">{a.text}</div>
//                       <div className="text-xs text-gray-500 dark:text-gray-300">{a.time}</div>
//                     </div>
//                   </div>
//                   <div className="text-xs text-gray-500">UI</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Order Details Modal (UI-only) */}
//       <AnimatePresence>
//         {selectedOrder && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
//             <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
//             <motion.div initial={{ scale: 0.95, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 12, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="relative max-w-3xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 ring-1 ring-white/20">
//               <button onClick={() => setSelectedOrder(null)} className="absolute right-4 top-4 p-2 rounded-full bg-white/30 dark:bg-gray-800/40 hover:bg-white/50 transition"><X size={18} /></button>

//               <div className="flex flex-col md:flex-row gap-6">
//                 <div className="w-full md:w-1/2 rounded-lg overflow-hidden shadow">
//                   <img src={selectedOrder.img} alt={selectedOrder.productName} className="w-full h-64 object-cover" />
//                 </div>

//                 <div className="flex-1">
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedOrder.productName}</h2>
//                   <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
//                     {selectedOrder.category} • {selectedOrder.color}
//                   </div>

//                   <div className="mt-4 flex items-center gap-3">
//                     <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-lg shadow-sm">${selectedOrder.price.toFixed(2)}</div>
//                     <StatusBadge status={selectedOrder.status} />
//                     <Stars rating={selectedOrder.rating} />
//                   </div>

//                   <p className="mt-4 text-gray-700 dark:text-gray-300">This is a UI-only preview of the order details. Use the buttons to simulate actions.</p>

//                   <div className="mt-6 flex flex-wrap gap-3">
//                     <button onClick={() => { addToCart(selectedOrder); showToast('Reorder (UI)'); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow">Reorder</button>
//                     <button onClick={() => showToast('Tracking opened (UI)')} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/40 dark:border-gray-600/40 bg-white/20 text-gray-800 dark:text-gray-100">Track</button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Cart drawer */}
//       <AnimatePresence>
//         {cartOpen && (
//           <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-60 flex">
//             <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
//             <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="relative ml-auto bg-white dark:bg-gray-900 rounded-tl-2xl rounded-bl-2xl shadow-2xl w-[620px] h-[90vh] max-h-[calc(100vh-40px)] m-6 overflow-hidden">
//               <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
//                 <div className="flex items-center gap-3">
//                   <ShoppingCart size={20} />
//                   <h3 className="text-lg font-semibold">Your Cart</h3>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="text-sm text-gray-500">{cart.length} items</div>
//                   <button onClick={() => setCartOpen(false)} className="p-2 rounded-full bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 transition"><X size={18} /></button>
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto h-[calc(90vh-200px)] space-y-4">
//                 {cart.length === 0 && <div className="text-center text-gray-600 dark:text-gray-300 py-20">Your cart is empty.</div>}
//                 {cart.map(it => (
//                   <div key={it.id} className="flex items-center gap-4 bg-white/50 dark:bg-gray-800/40 p-3 rounded-xl">
//                     <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
//                       <img src={it.img} alt={it.productName} className="w-full h-full object-cover" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-start gap-2">
//                         <div>
//                           <div className="font-semibold text-gray-900 dark:text-white truncate">{it.productName}</div>
//                           <div className="text-sm text-gray-500 dark:text-gray-300">ID: {it.id}</div>
//                         </div>
//                         <div className="text-lg font-bold text-gray-800 dark:text-gray-100">${(it.price * it.qty).toFixed(2)}</div>
//                       </div>

//                       <div className="mt-3 flex items-center gap-3">
//                         <div className="inline-flex items-center border rounded-xl overflow-hidden">
//                           <button onClick={() => decQty(it.id)} className="px-3 py-2 hover:bg-white/30"><Minus size={14} /></button>
//                           <div className="px-4 py-2 bg-white/20 text-sm">{it.qty}</div>
//                           <button onClick={() => incQty(it.id)} className="px-3 py-2 hover:bg-white/30"><Plus size={14} /></button>
//                         </div>

//                         <button onClick={() => removeFromCart(it.id)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"><X size={14} /></button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="border-t border-gray-100 dark:border-gray-800 p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="text-sm text-gray-600">Subtotal</div>
//                   <div className="text-lg font-bold">${subtotal.toFixed(2)}</div>
//                 </div>
//                 <div className="flex gap-3">
//                   <button onClick={() => showToast('Checkout (UI)')} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold">Checkout</button>
//                   <button onClick={() => { setCart([]); showToast('Cart cleared (UI)'); }} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">Clear</button>
//                 </div>
//               </div>
//             </motion.aside>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Toast */}
//       <AnimatePresence>
//         {toast && (
//           <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="fixed right-6 bottom-6 z-50">
//             <div className="bg-white rounded-xl px-4 py-2 shadow-lg text-sm font-medium">{toast}</div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Footer */}
//       <footer className="max-w-7xl mx-auto text-center mt-12 text-sm text-gray-600 dark:text-gray-400">
//         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/40 shadow-sm">
//           <MapPin size={14} /> Free standard shipping on orders over $50
//         </div>
//       </footer>
//     </div>
//   );
// }
