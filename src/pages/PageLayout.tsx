import { Box, Container, Flex, useBreakpoint } from '@chakra-ui/react';
import React from 'react';
import Sidebar from './sidebar/Sidebar';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const PageLayout = ({ children }: Props) => {
  const breakpoint = useBreakpoint();
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    breakpoint === 'base' ? (
      <Box p="6">{children}</Box>
    ) : (
      <Container maxW="md">{children}</Container>
    );
  return (
    <Flex>
      <Sidebar />
      <Wrapper>{children}</Wrapper>
    </Flex>
  );
};

export default PageLayout;
