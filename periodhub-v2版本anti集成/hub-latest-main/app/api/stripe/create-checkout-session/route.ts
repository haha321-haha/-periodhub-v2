import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { trackEvent } from "@/lib/analytics/posthog";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, mode, painPoint, assessmentScore } = await req.json();

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/assessment`,
      locale: "en",
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      metadata: {
        painPoint: painPoint || "unknown",
        assessmentScore: assessmentScore?.toString() || "0",
      },
    });

    trackEvent("checkout_initiated", {
      mode,
      priceId,
      painPoint,
      score: assessmentScore,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const stripeError = err as { type?: string; message?: string };

    trackEvent("checkout_error", {
      error: error.message,
      type: stripeError.type || "unknown",
    });

    // API 路由中的错误日志保留用于调试
    // eslint-disable-next-line no-console
    console.error("Stripe checkout error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
