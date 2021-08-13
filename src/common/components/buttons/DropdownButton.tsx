import { ChevronDownIcon as Down, ChevronUpIcon as Up } from '@chakra-ui/icons';
import { Button, ButtonProps, Text } from '@chakra-ui/react';
import React from 'react';

interface DropdownButtonProps extends ButtonProps {
  isExpanded: boolean;
  label?: string;
}

export const DropdownButton = React.forwardRef<HTMLButtonElement, DropdownButtonProps>(
  ({ isExpanded, label, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        aria-label="Show list"
        ml="2"
        minW={label ? '120px' : '30px'}
        w="32px"
        h="32px"
        p="0"
        borderColor="#F2F6EA"
        {...props}
      >
        {label && <Text mr="2">{label}</Text>}
        {isExpanded ? <Up /> : <Down />}
      </Button>
    );
  }
);
