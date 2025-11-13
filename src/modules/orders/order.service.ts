import { withTransaction } from '../../config/database';
import { RecordOrderInput } from './order.types';
import * as repository from './order.repository';

export const listOrders = repository.listOrders;
export const getOrderWithItems = repository.getOrderWithItems;
export const findByOpenCartId = repository.findByOpenCartId;

export const recordOrder = async (payload: RecordOrderInput) => {
  return withTransaction((connection) => repository.recordOrder(payload, connection));
};

export const updateOrderStatus = async (id: number, status: 'pending' | 'confirmed' | 'returned') => {
  return withTransaction((connection) => repository.updateOrderStatus(id, status, connection));
};

