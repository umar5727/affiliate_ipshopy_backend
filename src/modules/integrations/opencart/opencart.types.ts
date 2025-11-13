export interface OpenCartOrderItemPayload {
  productId: number;
  quantity: number;
  price: number;
}

export interface OpenCartOrderPayload {
  orderId: number;
  affiliateId: number;
  affiliateLinkId?: number | null;
  status: 'pending' | 'confirmed' | 'returned';
  totalAmount: number;
  orderDate: string;
  items: OpenCartOrderItemPayload[];
}

export interface StatusUpdatePayload {
  status: 'pending' | 'confirmed' | 'returned';
  confirmationDate?: string | null;
}

