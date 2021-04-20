import { Text } from '@chakra-ui/react';
import React from 'react';

interface FilterProps {
  isActive: boolean;
  onClick(): void;
  children: React.ReactNode | React.ReactNode[];
}

export const FilterText = ({ isActive, onClick, children, ...props }: FilterProps) => {
  return (
    <Text
      pb="2"
      px="4"
      mr="4"
      fontSize="lg"
      lineHeight="26px"
      fontWeight="500"
      _hover={{ textDecor: 'none' }}
      _focus={{ boxShadow: 'none' }}
      borderBottom={isActive ? '4px solid #78E08F' : 'none'}
      cursor="pointer"
      onClick={onClick}
      {...props}
    >
      {children}
    </Text>
  );
};
