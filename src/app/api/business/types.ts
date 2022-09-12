import { AccountAdvance } from '@appjusto/types';
import { IuguMarketplaceAccountAdvanceResponse } from '@appjusto/types/payment/iugu';

export interface CustomAccountAdvance extends AccountAdvance {
  data: IuguMarketplaceAccountAdvanceResponse;
}
