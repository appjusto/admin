import { BankAccount } from '@appjusto/types';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useQuery } from 'react-query';

export const useBusinessBankAccount = (isOnboarding: boolean = false) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;

  // queries
  const fetchBankAccount = () =>
    businessId ? api.business().fetchBankAccount(businessId) : undefined;
  const { data: bankAccount } = useQuery(['business:bank', businessId], fetchBankAccount);

  // mutations
  const { mutateAsync: updateBankAccount, mutationResult: updateResult } = useCustomMutation(
    async (changes: Partial<BankAccount>) => api.business().updateBankAccount(businessId, changes),
    'updateBankAccount',
    !isOnboarding
  );
  return { bankAccount, updateBankAccount, updateResult };
};
