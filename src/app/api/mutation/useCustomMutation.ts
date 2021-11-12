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
  fnName: string,
  dispatching: boolean = true,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
) => {
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { mutate, mutateAsync, isLoading, isSuccess, isError, error, reset } = useMutation(
    mutationFn,
    {
      onSuccess: () => {
        if (dispatching) dispatchAppRequestResult({ status: 'success', requestId: fnName });
      },
      onError: (error) => {
        dispatchAppRequestResult({ status: 'error', requestId: fnName, error });
      },
      ...options,
    }
  );
  React.useEffect(() => {
    if (!isSuccess && !isError) return;
    console.log('Call reset!');
    reset();
  }, [isSuccess, isError, reset]);
  if (isLoading) console.log(`${fnName} - isLoading:`, isLoading);
  if (isSuccess) console.log(`${fnName} - isSuccess:`, isSuccess);
  if (isError) console.log(`${fnName} - isError:`, isError);
  return { mutate, mutateAsync, mutationResult: { isLoading, isSuccess, isError, error } };
};
