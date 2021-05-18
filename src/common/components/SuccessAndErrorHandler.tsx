import { Box, useToast } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import React from 'react';

type Message = { title: string; description?: string };

interface SuccessAndErrorHandlersProps {
  isSuccess?: boolean;
  successMessage?: Message;
  isError?: boolean;
  error?: Error | unknown;
  errorMessage?: Message;
}

export const SuccessAndErrorHandler = React.memo(
  ({
    isSuccess,
    successMessage = { title: 'Informações savlas com sucesso!' },
    isError,
    error,
    errorMessage = {
      title: 'Não foi possível acessar o servidor',
      description: 'Tenta novamente?',
    },
  }: SuccessAndErrorHandlersProps) => {
    // state
    const [successStatus, setSuccessStatus] = React.useState(false);
    const [errorStatus, setErrorStatus] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    console.log('successStatus', successStatus);
    console.log('errorStatus', errorStatus);
    console.log('error', error);
    // helpers
    const toast = useToast();
    const successId = 'success-id';
    const errorId = 'error-id';

    // side effects
    React.useEffect(() => {
      if (isSuccess) setErrorStatus(false);
      if (isSuccess !== undefined)
        setSuccessStatus((prevStatus) => {
          if (prevStatus !== isSuccess) {
            setIsActive(false);
          }
          return isSuccess;
        });
    }, [isSuccess]);

    React.useEffect(() => {
      if (isError) setSuccessStatus(false);
      if (isError !== undefined)
        setErrorStatus((prevStatus) => {
          if (prevStatus !== isError) {
            setIsActive(false);
          }
          return isError;
        });
    }, [isError]);

    React.useEffect(() => {
      if (successStatus) {
        toast.closeAll();
        if (!toast.isActive(successId))
          toast({
            id: successId,
            title: successMessage.title,
            description: successMessage.description,
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
      }
    }, [successStatus, successMessage]);

    React.useEffect(() => {
      if (errorStatus) {
        toast.closeAll();
        if (error) Sentry.captureException(error);
        if (!toast.isActive(errorId))
          toast({
            id: errorId,
            title: errorMessage.title,
            description: errorMessage.description,
            status: 'warning',
            duration: 8000,
            isClosable: true,
          });
      }
    }, [errorStatus, error, errorMessage]);

    return <Box />;
  }
);
