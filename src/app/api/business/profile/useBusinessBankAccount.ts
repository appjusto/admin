import { BankAccount } from '@appjusto/types';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useBusinessBankAccount = (
  businessId?: string,
  isOnboarding: boolean = false
) => {
  // context
  const api = useContextApi();
  // const businessId = useContextBusinessId()!;

  // queries
  const fetchBankAccount = () =>
    businessId ? api.business().fetchBankAccount(businessId) : undefined;
  const { data: bankAccount } = useQuery(
    ['business:bank', businessId],
    fetchBankAccount
  );

  // mutations
  const { mutate: updateBankAccount, mutationResult: updateResult } =
    useCustomMutation(
      (changes: Partial<BankAccount>) =>
        api.business().updateBankAccount(businessId!, changes),
      'updateBankAccount',
      !isOnboarding
    );
  return { bankAccount, updateBankAccount, updateResult };
};
