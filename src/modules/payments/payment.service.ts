import * as repository from './payment.repository';
import { CreatePaymentRequest, UpdatePaymentStatus } from './payment.types';

export const listPayments = repository.listPayments;

export const createPaymentRequest = (payload: CreatePaymentRequest) => repository.createPaymentRequest(payload);

export const updatePayment = (id: number, payload: UpdatePaymentStatus) => repository.updatePayment(id, payload);

