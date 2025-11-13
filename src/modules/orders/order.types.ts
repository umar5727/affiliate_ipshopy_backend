export interface Order {
  id: number;
  orderIdOpencart: number;
  userId: number;
  status: 'pending' | 'confirmed' | 'returned';
  totalAmount: number;
  orderDate: Date;
  createdAt: Date;
}

export interface OrderWithItems extends Order {
  items: Array<{
    id: number;
    productId: number;
    quantity: number;
    price: number;
  }>;
}

export interface RecordOrderInput {
  orderIdOpencart: number;
  userId: number;
  status: 'pending' | 'confirmed' | 'returned';
  totalAmount: number;
  orderDate: Date;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
}

