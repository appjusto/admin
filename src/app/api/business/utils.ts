import { FetchAccountInformationResponse } from '@appjusto/types';
import {
  IuguMarketplaceAccountAdvanceByAmountResponse,
  IuguMarketplaceAccountAdvanceByAmountSimulation,
  IuguMarketplaceAccountWithdrawResponse,
} from '@appjusto/types/payment/iugu';
import { round } from 'lodash';
import { formatCurrency } from 'utils/formatters';

export const developmentFetchAccountInformation = () =>
  new Promise<FetchAccountInformationResponse>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        balance: 'R$ 5.000,00',
        balance_available_for_withdraw: 'R$ 4.500,00',
        receivable_balance: 'R$ 2.000,00',
        advanceable_value: 200000,
      });
    }, 2000);
  });

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

export const developmentRequestWithdraw = (amount: number) =>
  new Promise<IuguMarketplaceAccountWithdrawResponse>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        account_id: 'XXXYYYZZZ',
        account_name: 'Nome',
        amount: formatCurrency(amount),
        bank_address: {
          account_type: 'business',
          bank: 'BB',
          bank_ag: '0000',
          bank_cc: '0000-0',
        },
        created_at: 'date',
        custom_variables: [{ name: 'Nome', value: 'valor' }],
        feedback: 'feedback',
        id: 'AAABBBCCCDDDEEE',
        reference: 'reference',
        status: 'pending',
        updated_at: 'date',
      });
    }, 2000);
  });
