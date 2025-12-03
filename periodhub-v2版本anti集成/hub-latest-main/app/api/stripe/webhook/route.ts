import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { trackEvent } from '@/lib/analytics/posthog';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    
    trackEvent('webhook_signature_failed', {
      error: error.message,
    });
    
    // API 路由中的错误日志保留用于调试
    // eslint-disable-next-line no-console
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const customerId = session.customer as string;
      const customerEmail = session.customer_email;
      const subscriptionId = session.subscription as string;
      const painPoint = session.metadata?.painPoint || 'unknown';
      const score = session.metadata?.assessmentScore || '0';

      trackEvent('payment_success', {
        customerId,
        subscriptionId,
        mode: session.mode,
        amount: session.amount_total,
        painPoint,
        score: parseInt(score),
      });

      // 支付成功日志（生产环境可能需要监控）
      // eslint-disable-next-line no-console
      console.log('✅ Payment successful:', {
        email: customerEmail,
        painPoint,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    
    trackEvent('webhook_processing_error', {
      error: error.message,
      eventType: event.type,
    });

    // API 路由中的错误日志保留用于调试
    // eslint-disable-next-line no-console
    console.error('Webhook processing error:', error);
    
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
