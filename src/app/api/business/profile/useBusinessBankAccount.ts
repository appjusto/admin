import { useApi } from "app/state/api/context";
import { useContextBusinessId } from "app/state/business/context"
import { BankAccount } from "appjusto-types";
import { useMutation, useQuery } from "react-query"

export const useBusinessBankAccount = () => {
  // context
  const api = useApi();
  const businessId = useContextBusinessId()!;

  // queries
  const fetchBankAccount = (key: string) => api.business().fetchBankAccount(businessId);
  const { data: bankAccount } = useQuery(['business:bank', businessId], fetchBankAccount)

  // mutations
  const [updateBankAccount, updateResult] = useMutation(async (changes: Partial<BankAccount>) =>
    api.business().updateBankAccount(businessId, changes)
  );
  return { bankAccount, updateBankAccount, updateResult };
}