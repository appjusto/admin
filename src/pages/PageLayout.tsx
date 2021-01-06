import { Box, Container, Flex, useBreakpoint } from '@chakra-ui/react';
import React from 'react';
import Sidebar from './sidebar/Sidebar';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const Wrapper = ({ children }: Props) => {
  const breakpoint = useBreakpoint();
  if (breakpoint === 'base') <Box p="6">{children}</Box>;
  return (
    <Container>
      <Box w={['246px', '400px', '568px', '756px']} m="16">
        {children}
      </Box>
    </Container>
  );
};

const PageLayout = ({ children }: Props) => {
  return (
    <Flex w="100vw" minH="100vh">
      <Sidebar />
      <Box>
        <Wrapper>{children}</Wrapper>
      </Box>
    </Flex>
  );
};

export default PageLayout;
