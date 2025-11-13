import { UpdateCommissionStatusInput } from './commission.types';
import * as repository from './commission.repository';

export const listCommissions = repository.listCommissions;

export const updateCommissionStatus = (id: number, payload: UpdateCommissionStatusInput) =>
  repository.updateCommissionStatus(id, payload);

export const createCommission = repository.createCommission;
export const findByOrderId = repository.findByOrderId;

