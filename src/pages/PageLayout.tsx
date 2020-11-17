import { Flex } from '@chakra-ui/react';
import React from 'react';
import Sidebar from './sidebar/Sidebar';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const PageLayout = ({ children }: Props) => {
  return (
    <Flex>
      <Sidebar />
      {children}
    </Flex>
  );
};

export default PageLayout;
