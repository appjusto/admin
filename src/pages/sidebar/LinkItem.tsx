import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { isAccessGranted } from 'utils/access';

interface LinkItemProps {
  type?: 'admin' | 'backoffice';
  to: string;
  label: string;
  isDisabled?: boolean;
}

export const LinkItem = ({ type = 'admin', to, label, isDisabled }: LinkItemProps) => {
  // context
  const { role, backofficePermissions } = useContextFirebaseUser();
  let match = useRouteMatch({
    path: to,
    exact: true,
  });
  // helpers
  const userHasAccess = isAccessGranted(type, to, backofficePermissions, role);
  // UI
  if (isDisabled) {
    return (
      <Flex pl="6" h="34px" alignItems="center">
        <Text color="gray.600">{label}</Text>
      </Flex>
    );
  }
  return (
    <Flex
      display={userHasAccess ? 'flex' : 'none'}
      alignItems="center"
      bg={match ? 'white' : ''}
      fontSize="sm"
      fontWeight={match ? '700' : ''}
      pl={match ? '0' : '6'}
      height="34px"
      cursor="pointer"
      _hover={{ bg: 'white' }}
    >
      {match ? <Box w="4px" h="36px" bg="green.500" borderRadius="8px" ml="1" mr="4" /> : null}
      <Link
        as={RouterLink}
        to={to}
        w="100%"
        height="100%"
        display="flex"
        alignItems="center"
        aria-label={`sidebar-link-${label.toLowerCase()}`}
        _hover={{ textDecor: 'none' }}
        _focus={{ outline: 'none' }}
      >
        {label}
      </Link>
    </Flex>
  );
};
