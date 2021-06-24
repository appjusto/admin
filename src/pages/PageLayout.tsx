import { Container, Flex, FlexProps } from '@chakra-ui/react';
import React from 'react';
import { MenuMobile } from './MenuMobile';
import Sidebar from './sidebar/Sidebar';

interface PageLayoutProps extends FlexProps {
  maxW?: string;
  mt?: string;
}

const PageLayout = ({ maxW = '960px', mt = '0', children }: PageLayoutProps) => {
  // context
  // UI
  return (
    <Flex w="100vw" minH="100vh" maxW="100vw" mt={mt}>
      <MenuMobile />
      <Sidebar />
      <Flex w="100%" justifyContent="center">
        <Container
          w={{ base: '90%', lg: '100%' }}
          maxW={{ lg: maxW }}
          pt={{ base: '16', md: '10' }}
          pb={{ base: '8', md: '14' }}
        >
          {children}
        </Container>
      </Flex>
    </Flex>
  );
};

export default PageLayout;
