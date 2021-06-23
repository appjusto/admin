import { Link, LinkProps } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface CustomLinkProps extends LinkProps {
  to: string;
  children: React.ReactNode | React.ReactNode[];
}

export const CustomLink = ({ to, children, ...props }: CustomLinkProps) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      p="4"
      w="100%"
      borderRadius="lg"
      border="1px solid #C8D7CB"
      color="black"
      _hover={{ textDecor: 'none', bg: 'gray.200' }}
      {...props}
    >
      {children}
    </Link>
  );
};
