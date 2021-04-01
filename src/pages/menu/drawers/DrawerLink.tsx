import { Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';

interface LinkProps {
  to: string;
  label: string;
  isDisabled?: boolean;
}

export const DrawerLink = ({ to, label, isDisabled }: LinkProps) => {
  let match = useRouteMatch({
    path: to,
    exact: to.includes('complements') ? false : true,
  });
  if (isDisabled) {
    return (
      <Text pb="2" px="4" mr="4" fontSize="lg" fontWeight="500" color="gray.500">
        {label}
      </Text>
    );
  }
  return (
    <Link
      as={RouterLink}
      to={to}
      pb="2"
      px="4"
      mr="4"
      fontSize="lg"
      fontWeight="500"
      _hover={{ textDecor: 'none' }}
      _focus={{ boxShadow: 'none' }}
      borderBottom={match ? '4px solid #78E08F' : 'none'}
    >
      {label}
    </Link>
  );
};
