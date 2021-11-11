import { useToast } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { CustomToast } from 'common/components/CustomToast';
import { isEmpty } from 'lodash';
import React from 'react';

export interface AppRequestResult {
  status: 'success' | 'error';
  requestId: number;
  error?: unknown;
  message?: { title: string; description?: string };
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

export const AppRequestsProvider = ({ children }: Props) => {
  // state
  //const [state, dispatch] = React.useReducer(appRequestsReducer, initialState);
  const [requestId, setRequestId] = React.useState<number>();
  // handlers
  const toast = useToast();
  const dispatchAppRequestResult = React.useCallback(
    (result: AppRequestResult) => {
      if (result.requestId === requestId) return;
      const idString = result.requestId.toString();
      if (result.status === 'error') {
        if (result.error && !toast.isActive(idString)) Sentry.captureException(result.error);
        if (!toast.isActive(idString))
          toast({
            id: idString,
            duration: 8000,
            render: () => (
              <CustomToast
                type={isEmpty(result.error) ? 'warning' : 'error'}
                message={result.message ?? initErrorMsg}
              />
            ),
          });
      } else if (result.status === 'success') {
        if (!toast.isActive(idString))
          toast({
            id: idString,
            duration: 4000,
            render: () => <CustomToast type="success" message={result.message ?? initSuccessMsg} />,
          });
      }
      setRequestId(result.requestId);
    },
    [toast, requestId]
  );
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
