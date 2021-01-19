import { SmallAddIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';

export const AddButton = ({ ...props }) => {
  return (
    <Button
      ml="2"
      minW="30px"
      w="32px"
      h="32px"
      p="0"
      borderColor="#F2F6EA"
      aria-label="Add item"
      {...props}
    >
      <SmallAddIcon />
    </Button>
  );
};
