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
    console.log(successMessage, errorMessage);
    // handlers
    const handleStatus = React.useCallback(() => {
      const successId = 'success-toast';
      const errorId = 'error-toast';
      toast.closeAll();
      if (isSuccess) {
        if (!toast.isActive(successId))
          toast({
            id: successId,
            duration: 4000,
            render: () => <CustomToast type="success" message={successMessage ?? initSuccessMsg} />,
          });
      }
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
      }
    }, [isSuccess, isError, error, successMessage, errorMessage, toast]);

    // side effects
    React.useEffect(() => {
      handleStatus();
    }, [submission, handleStatus]);

    // UI
    return <Box />;
  }
);
