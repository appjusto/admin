import { Box, useToast } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { isEmpty } from 'lodash';
import React from 'react';
import { CustomToast } from './CustomToast';

type Message = { title: string; description?: string };

interface SuccessAndErrorHandlersProps {
  submission: number;
  isSuccess?: boolean;
  successMessage?: Message;
  isError?: boolean;
  error?: Error | unknown;
  errorMessage?: Message;
}

export const SuccessAndErrorHandler = React.memo(
  ({
    submission,
    isSuccess,
    successMessage = { title: 'Informações savlas com sucesso!' },
    isError,
    error,
    errorMessage = {
      title: 'Não foi possível acessar o servidor',
      description: 'Tenta novamente?',
    },
  }: SuccessAndErrorHandlersProps) => {
    // helpers
    const toast = useToast();
    console.log(submission, isSuccess, isError, error);
    // handlers
    const handleStatus = React.useCallback(() => {
      if (isSuccess) {
        toast.closeAll();
        toast({
          duration: 4000,
          render: () => (
            <CustomToast
              type="success"
              title={successMessage.title}
              description={successMessage.description}
            />
          ),
        });
      }
      if (isError) {
        toast.closeAll();
        if (error) Sentry.captureException(error);
        toast({
          duration: 8000,
          render: () => (
            <CustomToast
              type={isEmpty(error) ? 'warning' : 'error'}
              title={errorMessage.title}
              description={errorMessage.description}
            />
          ),
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError, error, toast]);

    // side effects
    React.useEffect(() => {
      handleStatus();
    }, [submission, handleStatus]);

    // UI
    return <Box />;
  }
);
