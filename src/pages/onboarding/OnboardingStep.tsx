import { Box, Center, Flex, FlexProps } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';
import { Checklist } from './checklist/Checklist';

interface Props extends FlexProps {}

export const OnboardingStep = ({ children }: Props) => {
  return (
    <Flex>
      <Box w="45%" h="100vh" bg="gray.50" flex={1}>
        <Center h="100%">
          <Box>
            <Logo />
            <Checklist mt="8" />
          </Box>
        </Center>
      </Box>
      <Flex direction="column" w="55%" h="100vh" overflow="scroll">
        <Center flex={1}>
          <Box w={['246px', null, '328px', '656px']} m="16">
            {children}
          </Box>
        </Center>
      </Flex>
    </Flex>
  );
};
