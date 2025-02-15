export interface User {
    user_id: string; // Firebase UID
    email: string;
    name?: string;
    created_at: string; // ISO timestamp
  }
  
  export interface Subscription {
    subscription_id: string;
    user_id: string;
    stripe_customer_id: string;
    stripe_subscription_id: string;
    status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'expired';
    start_date: string; 
    end_date: string; // ISO timestamp
    plan: string; // Default: "single plan"
    last_payment_date: string; // ISO timestamp
  }
  
  export interface Payment {
    payment_id: string;
    user_id: string;
    stripe_charge_id: string;
    amount: number;
    currency: string; // e.g., "USD"
    status: 'succeeded' | 'failed' | 'pending';
    payment_method: string; // e.g., card, PayPal
    created_at: string; // ISO timestamp
  }
  
  export interface Chat {
    chat_id: string;
    user_id: string;
    created_at: string; // ISO timestamp
    expires_at: string; // ISO timestamp (Auto-delete after 30 days)
  }
  
  export interface Message {
    message_id: string;
    chat_id: string;
    sender: 'user' | 'CarTechAI';
    message: string;
    timestamp: string; // ISO timestamp
  }
  