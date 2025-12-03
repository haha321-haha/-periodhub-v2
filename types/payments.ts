// 支付相关类型定义

export interface ProUpgradeRequest {
  plan: 'monthly' | 'yearly' | 'oneTime';
  painPoint?: string;
  assessmentScore?: number;
  source?: string;
  customData?: Record<string, any>;
}

export interface LemonSqueezyCheckoutResponse {
  url: string;
  checkoutId: string;
}

export interface LemonSqueezyWebhookPayload {
  data: {
    id: string;
    type: string;
    attributes: {
      customer_id: string;
      order_id: number;
      product_id: number;
      variant_id: number;
      user_name: string;
      user_email: string;
      currency: string;
      subtotal: number;
      discount_total: number;
      tax_total: number;
      total: number;
      tax_name: string;
      tax_rate: number;
      status: string;
      refunded: boolean;
      refunded_at: string | null;
      created_at: string;
      updated_at: string;
      test_mode: boolean;
      custom_data?: Record<string, any>;
    };
  };
  meta: {
    event_name: string;
    custom_data?: Record<string, any>;
  };
}