import { Box, useToast } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { isEmpty } from 'lodash';
import React from 'react';
import { CustomToast } from '../CustomToast';
import { Message } from './utils';
interface SuccessAndErrorHandlersProps {
  submission: number;
  isSuccess?: boolean;
  successMessage?: Message;
  isError?: boolean;
  error?: Error | unknown;
  errorMessage?: Message;
}

const initSuccessMsg = { title: 'Informações savlas com sucesso!' };
const initErrorMsg = {
  title: 'Não foi possível acessar o servidor',
  description: 'Tenta novamente?',
};

export const SuccessAndErrorHandler = React.memo(
  ({
    submission,
    isSuccess,
    successMessage,
    isError,
    error,
    errorMessage,
  }: SuccessAndErrorHandlersProps) => {
    // helpers
    const toast = useToast();
    // handlers
    const handleStatus = React.useCallback(() => {
      const successId = 'success-toast';
      const errorId = 'error-toast';
      //if (isLoading) return;
      if (isError) {
        if (error && !toast.isActive(errorId)) Sentry.captureException(error);
        if (!toast.isActive(errorId))
          toast({
            id: errorId,
            duration: 8000,
            render: () => (
              <CustomToast
                type={isEmpty(error) ? 'warning' : 'error'}
                message={errorMessage ?? initErrorMsg}
              />
            ),
          });
      } else if (isSuccess) {
        if (!toast.isActive(successId))
          toast({
            id: successId,
            duration: 4000,
            render: () => <CustomToast type="success" message={successMessage ?? initSuccessMsg} />,
          });
      }
    }, [isSuccess, isError, error, successMessage, errorMessage, toast]);

    // side effects
    React.useEffect(() => {
      toast.closeAll();
      handleStatus();
    }, [submission, toast, handleStatus]);

    // UI
    return <Box />;
  }
);
