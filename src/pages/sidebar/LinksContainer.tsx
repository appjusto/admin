import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

interface LinkItemProps {
  to: string;
  children: React.ReactElement;
}

const LinkItem = ({ to, children }: LinkItemProps) => {
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
      height="40px"
      _hover={{ bg: 'gray.200' }}
    >
      {match ? <Box w="4px" h="36px" bg="green.500" borderRadius="8px" ml="1" mr="4" /> : null}
      {children}
    </Flex>
  );
};

interface LinksContainerProps {
  children: React.ReactElement | React.ReactElement[];
}

export const LinksContainer = ({ children }: LinksContainerProps) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        return <LinkItem {...child.props}>{child}</LinkItem>;
      })}
    </>
  );
};
