import { Center, Progress } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';

interface LoadingProps {
  timeout?: number; // in seconds
}

export const Loading = ({ timeout = 3 }: LoadingProps) => {
  // state
  const [timer, setTimer] = React.useState(0);
  // side effects
  React.useEffect(() => {
    const timer = setInterval(() => setTimer((prev) => prev + 100 / timeout), 1000);
    return () => clearInterval(timer);
  }, []);
  // UI
  return (
    <Center h="100vh" flexDirection="column">
      <Progress position="absolute" top="0" w="full" value={timer} size="xs" />
      <Logo />
    </Center>
  );
};
