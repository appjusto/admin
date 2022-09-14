import { FetchAccountInformationResponse } from '@appjusto/types';
import {
  IuguMarketplaceAccountAdvanceByAmountResponse,
  IuguMarketplaceAccountAdvanceByAmountSimulation,
} from '@appjusto/types/payment/iugu';
import { round } from 'lodash';

export const developmentFetchAccountInformation =
  (): FetchAccountInformationResponse => {
    return {
      balance: 'R$ 5.000,00',
      balance_available_for_withdraw: 'R$ 4.500,00',
      receivable_balance: 'R$ 2.000,00',
      advanceable_value: 200000,
    };
  };

export const developmentFetchAdvanceSimulation = (amount: number) =>
  new Promise<IuguMarketplaceAccountAdvanceByAmountSimulation>(
    (resolve, reject) => {
      const value = amount * 0.98;
      const fee = value * 0.024;
      const installments = round(value / 60);
      setTimeout(() => {
        resolve({
          nearest: {
            advanceable_amount_cents: value,
            advancement_fee_cents: fee,
            advanceable_installments: installments,
            simulation_id: '100',
          },
          farthest: {
            advanceable_amount_cents: value,
            advancement_fee_cents: fee + 25,
            advanceable_installments: installments,
            simulation_id: '100',
          },
        });
      }, 2000);
    }
  );

export const developmentAdvanceReceivables = () =>
  new Promise<IuguMarketplaceAccountAdvanceByAmountResponse>(
    (resolve, reject) => {
      setTimeout(() => {
        resolve({
          result: {
            advancement_request: 'R$ 2.000,00',
          },
        });
      }, 2000);
    }
  );
