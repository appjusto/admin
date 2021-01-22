import { DeleteIcon } from '@chakra-ui/icons';
import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

export const DeleteButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <Button
      ref={ref}
      variant="dangerLight"
      ml="2"
      minW="30px"
      w="32px"
      h="32px"
      p="0"
      borderColor="#F2F6EA"
      aria-label="Add item"
      {...props}
    >
      <DeleteIcon />
    </Button>
  );
});
