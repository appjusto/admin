import { Box, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';

interface LinkItemProps {
  to: string;
  label: string;
}

export const LinkItem = ({ to, label }: LinkItemProps) => {
  let match = useRouteMatch({
    path: to,
    exact: true,
  });
  return (
    <Flex
      alignItems="center"
      bg={match ? 'white' : ''}
      fontSize="sm"
      fontWeight={match ? '700' : ''}
      pl={match ? '0' : '6'}
      height="34px"
      cursor="pointer"
      _hover={match ? {} : { bg: 'gray.100' }}
    >
      {match ? <Box w="4px" h="36px" bg="green.500" borderRadius="8px" ml="1" mr="4" /> : null}
      <Link
        as={RouterLink}
        to={to}
        w="100%"
        height="100%"
        display="flex"
        alignItems="center"
        _hover={{ textDecor: 'none' }}
        _focus={{ outline: 'none' }}
      >
        {label}
      </Link>
    </Flex>
  );
};
