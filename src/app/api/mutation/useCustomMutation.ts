import { useContextAppRequests } from 'app/state/requests/context';
import { useMutation } from 'react-query';

export const useCustomMutation = (data: any, func: Function) => {
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { mutate } = useMutation(() => func(...data), {
    onSuccess: () => {
      dispatchAppRequestResult({ status: 'success', requestId: Math.random() });
    },
    onError: (error) => {
      dispatchAppRequestResult({ status: 'error', requestId: Math.random(), error });
    },
  });
  return mutate;
};
