import { Box, Flex, FlexProps } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';
import { Checklist } from './checklist/Checklist';
import OnbFooter from './OnbFooter';

interface Props extends FlexProps {}

const OnboardingStep = ({ children }: Props) => {
  return (
    <Box minW="100vw" minH="100vh">
      <Box
        pos="absolute"
        top="0"
        left="0"
        w={{ base: '100%', md: '35%', lg: '45%' }}
        minH={{ base: '360px', md: '100%' }}
        bg="gray.50"
        zIndex="-1"
      />
      <Container py="12">
        <Flex w="100%" flexDir={{ base: 'column', md: 'row' }}>
          <Box w={{ md: '35%', lg: '45%' }} mt="4" pr={{ md: '2' }}>
            <Logo />
            <Checklist mt="8" />
          </Box>
          <Flex
            direction="column"
            w={{ md: '65%', lg: '55%' }}
            minH={{ base: 'auto', md: '100vh' }}
            mt={{ base: '14', md: '0' }}
          >
            <Box w={{ base: '100%', md: '460px', lg: '600px' }} pl={{ md: '10', lg: '16' }}>
              {children}
            </Box>
          </Flex>
        </Flex>
      </Container>
      <OnbFooter />
    </Box>
  );
};

export default OnboardingStep;
