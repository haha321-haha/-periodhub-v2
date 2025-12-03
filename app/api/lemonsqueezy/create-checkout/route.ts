import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;

export async function POST(req: NextRequest) {
  try {
    const { variantId, plan, painPoint, assessmentScore } = await req.json();
    
    // 动态获取协议和主机，适应任何部署环境
    const origin = req.headers.get('origin') || 
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    
    // 检查Lemon Squeezy配置
    if (!API_KEY || API_KEY === 'your_lemonsqueezy_api_key_here') {
      return NextResponse.json(
        { error: 'Payment service is not configured. Please contact support.' },
        { status: 503 }
      );
    }
    
    if (!STORE_ID || STORE_ID === 'your_store_id_here') {
      return NextResponse.json(
        { error: 'Payment service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // 如果传递了 plan 而不是 variantId，根据 plan 获取 variantId
    let finalVariantId = variantId;
    if (!finalVariantId && plan) {
      const variants = {
        monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY,
        yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_YEARLY,
        oneTime: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ONETIME,
      };
      finalVariantId = variants[plan as keyof typeof variants] || variants.monthly;
    }

    if (!finalVariantId) {
      throw new Error('Missing variant ID or plan');
    }

    // Lemon Squeezy API调用创建checkout
    const response = await fetch(`https://api.lemonsqueezy.com/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            store_id: STORE_ID,
            variant_id: finalVariantId,
            custom_price: null,
            product_options: {
              redirect_url: `${origin}/success?checkout_id={CHECKOUT_ID}`,
              receipt_button_text: 'Go to Dashboard',
              receipt_thank_you_note: 'Thank you for your PeriodHub purchase!',
              receipt_link_url: `${origin}/dashboard`,
            },
            checkout_data: {
              email: null,
              name: null,
              billing_address: null,
              tax_number: null,
              discount_code: null,
              custom: {
                painPoint: painPoint || 'unknown',
                assessmentScore: assessmentScore?.toString() || '0',
                source: 'periodhub_web',
              },
            },
            preview: false,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Lemon Squeezy API error: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    const checkoutUrl = data.data.attributes.url;
    
    if (!checkoutUrl) {
      throw new Error('No checkout URL received from Lemon Squeezy');
    }

    console.log('✅ Checkout created successfully:', checkoutUrl);

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    
    console.error('❌ Lemon Squeezy checkout error:', error);
    
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}