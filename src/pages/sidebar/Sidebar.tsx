import { Box } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';
import BusinessInfo from './BusinessInfo';
import { Links } from './Links';

const Sidebar = () => {
  return (
    <Box d={['none', 'block']} w="220px" bg="gray.300" flexShrink={0}>
      <Box ml="4" mt="6">
        <Logo />
      </Box>
      <Box ml="4" mt="6">
        <BusinessInfo />
      </Box>
      <Box mt="6">
        <Links />
      </Box>
    </Box>
  );
};

export default Sidebar;
