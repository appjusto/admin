import { Container, Flex, FlexProps } from '@chakra-ui/react';
import React from 'react';
import Sidebar from './sidebar/Sidebar';

const PageLayout = ({ children }: FlexProps) => {
  return (
    <Flex w="100vw" maxH="100vh">
      <Sidebar />
      <Flex w="100%" justifyContent="center" overflowY="scroll">
        <Container
          w={{ base: '90%', lg: '100%' }}
          maxW={{ lg: '1200px' }}
          pt={{ base: '6', md: '10' }}
        >
          {children}
        </Container>
      </Flex>
    </Flex>
  );
};

export default PageLayout;
