import { FetchAccountInformationResponse } from '@appjusto/types';
import {
  IuguMarketplaceAccountAdvanceByAmountResponse,
  IuguMarketplaceAccountAdvanceByAmountSimulation,
  IuguMarketplaceAccountWithdrawResponse,
} from '@appjusto/types/payment/iugu';
import { FirebaseError } from 'firebase/app';
import { round } from 'lodash';
import { formatCurrency } from 'utils/formatters';

let accountInfoRequestNumber = 0;
let withdrawRequestNumber = 0;

export const developmentFetchAccountInformation = (isError?: boolean) =>
  new Promise<FetchAccountInformationResponse>((resolve, reject) => {
    setTimeout(() => {
      if (isError) {
        reject(
          new FirebaseError(
            'permission-denied',
            'Usuário não tem permissão para realizar a operação.'
          )
        );
      }
      const clearWithdrawValue =
        accountInfoRequestNumber > 0 && withdrawRequestNumber > 0;
      const availableWithdraw = clearWithdrawValue ? 'R$ 0,00' : 'R$ 4.500,00';
      const result = {
        balance: 'R$ 5.000,00',
        balance_available_for_withdraw: availableWithdraw,
        receivable_balance: 'R$ 2.460,00',
        advanceable_value: 200000,
      };
      accountInfoRequestNumber += 1;
      resolve(result);
    }, 2000);
  });

export const developmentFetchAdvanceSimulation = (
  amount: number,
  isError?: boolean
) =>
  new Promise<IuguMarketplaceAccountAdvanceByAmountSimulation>(
    (resolve, reject) => {
      const value = amount === 200000 ? 200000 : amount * 0.98;
      const fee = value * 0.024;
      const installments = round(value / 60);
      setTimeout(() => {
        if (isError) {
          reject(
            new FirebaseError(
              'permission-denied',
              'Usuário não tem permissão para realizar a operação.'
            )
          );
        }
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

export const developmentAdvanceReceivables = (isError?: boolean) =>
  new Promise<IuguMarketplaceAccountAdvanceByAmountResponse>(
    (resolve, reject) => {
      setTimeout(() => {
        if (isError) {
          reject(
            new FirebaseError(
              'permission-denied',
              'Usuário não tem permissão para realizar a operação.'
            )
          );
        }
        resolve({
          result: {
            advancement_request: 'R$ 2.000,00',
          },
        });
      }, 2000);
    }
  );

export const developmentRequestWithdraw = (amount: number, isError?: boolean) =>
  new Promise<IuguMarketplaceAccountWithdrawResponse>((resolve, reject) => {
    setTimeout(() => {
      if (isError) {
        reject(
          new FirebaseError(
            'permission-denied',
            'Usuário não tem permissão para realizar a operação.'
          )
        );
      } else {
        withdrawRequestNumber += 1;
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
      }
    }, 2000);
  });
