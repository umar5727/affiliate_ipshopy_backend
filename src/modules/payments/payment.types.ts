export interface Payment {
  id: number;
  userId: number;
  amount: number;
  status: 'requested' | 'approved' | 'paid' | 'declined';
  paymentDate: Date | null;
  adminRemarks: string | null;
  transactionRef: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRequest {
  userId: number;
  amount: number;
  adminRemarks?: string | null;
}

export interface UpdatePaymentStatus {
  status: 'approved' | 'paid' | 'declined';
  paymentDate?: Date | null;
  transactionRef?: string | null;
  adminRemarks?: string | null;
}

