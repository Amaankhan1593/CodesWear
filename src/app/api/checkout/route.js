import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs"; // Stripe needs Node.js runtime (not Edge)

function absoluteUrl(req, path) {
  const origin =
    req.headers.get("origin") ||
    `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`;
  return `${origin}${path}`;
}

export async function POST(req) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      console.error("STRIPE_SECRET_KEY missing at runtime");
      return NextResponse.json(
        { error: "Server misconfigured. Missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secret);

    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const currency = String(body?.currency || "usd").toLowerCase();

    if (items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const line_items = items.map((it) => ({
      quantity: Math.max(1, Number(it?.quantity ?? 1)),
      price_data: {
        currency,
        unit_amount: Math.round(Number(it?.price) * 100), // e.g., 45.00 -> 4500
        product_data: {
          name: String(it?.name ?? "Item"),
          images: it?.image ? [String(it.image)] : [],
          metadata: it?.id ? { id: String(it.id) } : undefined,
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: absoluteUrl(req, "/success"),
      cancel_url: absoluteUrl(req, "/cancel"),
    });

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout error";
    console.error("Checkout error:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
