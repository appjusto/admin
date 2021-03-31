import { Box } from '@chakra-ui/react';
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
    <Box
      d="flex"
      alignItems="center"
      bg={match ? 'white' : ''}
      fontSize="sm"
      fontWeight={match ? '700' : ''}
      pl={match ? '0' : '4'}
      mt="1"
      height="32px"
    >
      {match ? <Box w="4px" height="100%" bg="green.500" borderRadius="8px" mx="2" /> : null}
      {children}
    </Box>
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
