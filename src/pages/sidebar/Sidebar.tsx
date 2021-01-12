import { Box } from '@chakra-ui/react';
import Image from 'common/components/Image';
import logo from 'common/img/logo.svg';
import React from 'react';
import BusinessInfo from './BusinessInfo';
import { Links } from './Links';

const Sidebar = () => {
  return (
    <Box position="relative" d={['none', 'block']} w="220px" bg="gray.300" flexShrink={0}>
      <Box position="fixed" top="8" left="2">
        <Box ml="4" mt="6">
          <Image src={logo} />
        </Box>
        <Box ml="4" mt="6">
          <BusinessInfo />
        </Box>
        <Box mt="6">
          <Links />
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
