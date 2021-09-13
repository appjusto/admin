import { useContextApi } from 'app/state/api/context';
import { useMutation } from 'react-query';

export const useAdvanceReceivables = (businessId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const [advanceReceivables, advanceReceivablesResult] = useMutation(async (ids: number[]) =>
    api.business().advanceReceivables(businessId!, ids)
  );
  // return
  return { advanceReceivables, advanceReceivablesResult };
};
