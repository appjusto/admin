import { Center } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';

export const Loading = () => {
  return (
    <Center h="100vh">
      <Logo />
    </Center>
  );
};
