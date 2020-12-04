import { Box, Container, Flex, useBreakpoint } from '@chakra-ui/react';
import React from 'react';
import Sidebar from './sidebar/Sidebar';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const Wrapper = ({ children }: Props) => {
  const breakpoint = useBreakpoint();
  if (breakpoint === 'base') <Box p="6">{children}</Box>;
  return <Container maxW="md">{children}</Container>;
};

const PageLayout = ({ children }: Props) => {
  return (
    <Flex>
      <Sidebar />
      <Wrapper>{children}</Wrapper>
    </Flex>
  );
};

export default PageLayout;
