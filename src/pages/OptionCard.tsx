import { Box } from '@chakra-ui/react';
import React from 'react';

interface OptionCardProps {
  isSelected?: boolean;
  children: React.ReactNode;
}

export const OptionCard = ({ isSelected, children }: OptionCardProps) => {
  return (
    <Box
      p="8"
      w="100%"
      border={isSelected ? '2px solid' : '1px solid'}
      borderColor={isSelected ? 'green.500' : '#C8D7CB'}
      borderRadius="lg"
      boxShadow="0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)"
    >
      {children}
    </Box>
  );
};
