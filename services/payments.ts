import { api } from './api';

export interface PaymentDTO {
  id: number;
  phoneNumber: string;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionReference: string;
  planName: string;
  createdAt: string;
}

export interface InitiatePaymentRequest {
  phoneNumber: string;
  planId: number;
  paymentMethod: string;
}

export interface VerifyPaymentRequest {
  transactionReference: string;
}

export const paymentsService = {
  initiatePayment: (body: InitiatePaymentRequest) =>
    api.post<PaymentDTO>('/payments/initiate', body),

  verifyPayment: (body: VerifyPaymentRequest) =>
    api.post<PaymentDTO>('/payments/verify', body),
};

