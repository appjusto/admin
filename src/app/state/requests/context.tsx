import { useToast } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { FirebaseError } from 'app/api/types';
import { CustomToast } from 'common/components/CustomToast';
import { getFirebaseErrorMessage } from 'core/fb';
import { isEmpty } from 'lodash';
import React from 'react';

const skippedExceptions = [
  'auth/user-not-found',
  'auth/wrong-password',
  'auth/invalid-action-code',
  'auth/too-many-requests',
  'auth/requires-recent-login',
  'auth/network-request-failed',
];

type ErrorMessage = { title: string; description?: string };

export interface AppRequestResult {
  status: 'success' | 'error';
  requestId: string;
  error?: unknown;
  message?: ErrorMessage;
  duration?: number;
}

interface AppRequestsContextProps {
  dispatchAppRequestResult: (result: AppRequestResult) => void;
}

const AppRequestsContext = React.createContext<AppRequestsContextProps>(
  {} as AppRequestsContextProps
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const initSuccessMsg = { title: 'Informações salvas com sucesso!' };
const initErrorMsg = {
  title: 'Não foi possível acessar o servidor',
  description: 'Tenta novamente?',
};

const getErrorMessage = (errorMessage?: ErrorMessage, error?: unknown): ErrorMessage => {
  if (errorMessage) return errorMessage;
  else if (error) {
    const message = getFirebaseErrorMessage(error);
    return {
      title: 'Erro:',
      description: message,
    };
  }
  return initErrorMsg;
};

export const AppRequestsProvider = ({ children }: Props) => {
  // state
  const [requestId, setRequestId] = React.useState<string>();
  // handlers
  const toast = useToast();
  const dispatchAppRequestResult = React.useCallback(
    (result: AppRequestResult) => {
      if (result.requestId === requestId) return;
      if (result.status === 'error') {
        if (result.error && !toast.isActive(result.requestId)) {
          const { code } = result.error as FirebaseError;
          if (!code || !skippedExceptions.includes(code)) Sentry.captureException(result.error);
        }
        const errorMessage = getErrorMessage(
          result.message,
          result.error ? result.error : undefined
        );
        if (!toast.isActive(result.requestId))
          toast({
            id: result.requestId,
            duration: result.duration ?? 8000,
            render: () => (
              <CustomToast
                type={isEmpty(result.error) ? 'warning' : 'error'}
                message={errorMessage}
              />
            ),
          });
      } else if (result.status === 'success') {
        if (!toast.isActive(result.requestId))
          toast({
            id: result.requestId,
            duration: result.duration ?? 4000,
            render: () => <CustomToast type="success" message={result.message ?? initSuccessMsg} />,
          });
      }
      setRequestId(result.requestId);
    },
    [toast, requestId]
  );
  // side effects
  React.useEffect(() => {
    if (!requestId) return;
    const timeOut = setTimeout(() => setRequestId(undefined), 4000);
    return () => clearTimeout(timeOut);
  }, [requestId]);
  // provider
  return (
    <AppRequestsContext.Provider value={{ dispatchAppRequestResult }}>
      {children}
    </AppRequestsContext.Provider>
  );
};

export const useContextAppRequests = () => {
  return React.useContext(AppRequestsContext);
};
