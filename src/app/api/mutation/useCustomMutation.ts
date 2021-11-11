import { useContextAppRequests } from 'app/state/requests/context';
import { useMutation, MutationFunction, UseMutationOptions } from 'react-query';

export interface MutationResult {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: unknown;
}

export const useCustomMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  noDispatch: boolean = false,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
) => {
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { mutate, mutateAsync, isLoading, isSuccess, isError, error } = useMutation(mutationFn, {
    onSuccess: () => {
      if (!noDispatch) dispatchAppRequestResult({ status: 'success', requestId: Math.random() });
    },
    onError: (error) => {
      dispatchAppRequestResult({ status: 'error', requestId: Math.random(), error });
    },
    ...options,
  });
  return { mutate, mutateAsync, mutationResult: { isLoading, isSuccess, isError, error } };
};
