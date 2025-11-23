/**
 * Payment models and types
 */

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'voucher';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: PaymentMethod;
}

export interface PaymentResponse {
  success: boolean;
  payment?: Payment;
  message?: string;
}

export interface CashPayment {
  tendered: number;
  change: number;
}

export interface CardPayment {
  last4: string;
  cardType: string;
  authCode: string;
}
