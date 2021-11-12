import { useContextAppRequests } from 'app/state/requests/context';
import { useMutation, MutationFunction, UseMutationOptions } from 'react-query';
import React from 'react';

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
  dispatching: boolean = true,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
) => {
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { mutate, mutateAsync, isLoading, isSuccess, isError, error, reset } = useMutation(
    mutationFn,
    {
      onSuccess: () => {
        if (dispatching) dispatchAppRequestResult({ status: 'success', requestId: Math.random() });
      },
      onError: (error) => {
        dispatchAppRequestResult({ status: 'error', requestId: Math.random(), error });
      },
      ...options,
    }
  );
  React.useEffect(() => {
    if (!isSuccess && !isError) return;
    console.log('Call reset!');
    reset();
  }, [isSuccess, isError, reset]);
  if (isLoading) console.log('isLoading', isLoading);
  if (isSuccess) console.log('isSuccess', isSuccess);
  if (isError) console.log('isError', isError);
  return { mutate, mutateAsync, mutationResult: { isLoading, isSuccess, isError, error } };
};
