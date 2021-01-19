import { ChevronDownIcon as Down, ChevronUpIcon as Up } from '@chakra-ui/icons';
import { Button, ButtonProps } from '@chakra-ui/react';

interface DropdownButtonProps extends ButtonProps {
  isExpanded: boolean;
}

export const DropdownButton = ({ isExpanded, ...props }: DropdownButtonProps) => {
  return (
    <Button
      variant="outline"
      aria-label="Show list"
      ml="2"
      minW="30px"
      w="32px"
      h="32px"
      p="0"
      borderColor="#F2F6EA"
      {...props}
    >
      {isExpanded ? <Up /> : <Down />}
    </Button>
  );
};
