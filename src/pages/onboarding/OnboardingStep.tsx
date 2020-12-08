import { Box, Center, Flex, FlexProps } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';
import { Checklist } from './checklist/Checklist';

interface Props extends FlexProps {

}

export const OnboardingStep = ({ children }: Props) => {
  return (
    <Flex>
      <Box w="45%" h="100vh" bg="gray.50">
        <Center h="100%">
          <Box>
            <Logo />
          <Checklist mt="8" />
          </Box>
        </Center>
      </Box>
      <Box w="55%" h="100vh">
        <Center h="100%">
          {children}
        </Center>
      </Box>
    </Flex>
  );
}
