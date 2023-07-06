import { AccountAdvance, Business, WithId } from '@appjusto/types';
import { IuguMarketplaceAccountAdvanceResponse } from '@appjusto/types/payment/iugu';

export interface CustomAccountAdvance extends AccountAdvance {
  data: IuguMarketplaceAccountAdvanceResponse;
}

export type BusinessUnit = {
  id: string;
  name: string;
  address: string;
};

export type ObserveBusinessesManagedByResponse = {
  current: WithId<Business> | null;
  units: BusinessUnit[] | null;
};
