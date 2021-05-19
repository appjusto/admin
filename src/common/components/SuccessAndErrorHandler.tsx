import { Box, useToast } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import React from 'react';

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

    // handlers
    const handleStatus = React.useCallback(() => {
      if (isSuccess) {
        toast.closeAll();
        toast({
          title: successMessage.title,
          description: successMessage.description,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
      if (isError) {
        toast.closeAll();
        if (error) Sentry.captureException(error);
        toast({
          title: errorMessage.title,
          description: errorMessage.description,
          status: 'warning', // error ? 'error : 'warning
          duration: 8000,
          isClosable: true,
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
