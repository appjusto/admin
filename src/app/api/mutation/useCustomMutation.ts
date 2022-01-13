import { useContextAppRequests } from 'app/state/requests/context';
import { useMutation, MutationFunction, UseMutationOptions } from 'react-query';
import React from 'react';

const monitoringMutation =
  process.env.REACT_APP_ENVIRONMENT === 'dev' || process.env.REACT_APP_ENVIRONMENT === 'staging';

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
  resetting: boolean = true,
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
    if (!resetting) return;
    if (!isSuccess && !isError) return;
    if (monitoringMutation) console.log('Call reset!');
    reset();
  }, [resetting, isSuccess, isError, reset]);
  if (monitoringMutation && isLoading)
    console.log(`${fnName} - %cisLoading: ${isLoading}`, 'color: blue');
  if (monitoringMutation && isSuccess)
    console.log(`${fnName} - %cisSuccess: ${isSuccess}`, 'color: green');
  if (isError) console.log(`${fnName} - %cisError: ${isError}`, 'color: red');
  return { mutate, mutateAsync, mutationResult: { isLoading, isSuccess, isError, error } };
};
