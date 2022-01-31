import { Text } from '@chakra-ui/react';
import React from 'react';

interface FilterProps {
  isActive: boolean;
  label: string;
  onClick(): void;
}

export const FilterText = ({ isActive, label, onClick, ...props }: FilterProps) => {
  return (
    <Text
      pb="2"
      px="4"
      fontSize="16px"
      lineHeight="24px"
      fontWeight="500"
      _hover={{ textDecor: 'none' }}
      _focus={{ boxShadow: 'none' }}
      borderBottom={isActive ? '4px solid #78E08F' : 'none'}
      cursor="pointer"
      onClick={onClick}
      aria-label={`nav-${label}`}
      {...props}
    >
      {label}
    </Text>
  );
};
