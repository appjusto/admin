import { Box, Center, Flex, FlexProps } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';
import { Checklist } from './checklist/Checklist';

interface Props extends FlexProps {}

export const OnboardingStep = ({ children }: Props) => {
  return (
    <Flex flexDir={{ base: 'column', md: 'row' }}>
      <Box w={{ md: '35%', lg: '45%' }} h={{ base: 'auto', md: '100vh' }} bg="gray.50" flex={1}>
        <Center h="100%">
          <Box px="4" py="6">
            <Logo />
            <Checklist mt="8" />
          </Box>
        </Center>
      </Box>
      <Flex
        direction="column"
        w={{ md: '65%', lg: '55%' }}
        h={{ base: 'auto', md: '100vh' }}
        overflow="scroll"
      >
        <Center flex={1}>
          <Box w={{ base: '100%', md: '460px', lg: '600px' }} p={{ base: '4', md: '10', lg: '16' }}>
            {children}
          </Box>
        </Center>
      </Flex>
    </Flex>
  );
};
