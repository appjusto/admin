import { Box, Button, ButtonProps, Flex, Text } from '@chakra-ui/react';

interface ItemsQtdButtonsProps extends ButtonProps {
  label?: string;
  value: number;
  increment(): void;
  decrement(): void;
}

export const ItemsQtdButtons = ({
  label,
  value,
  increment,
  decrement,
  mt,
  mb,
  ml,
  mr,
  ...props
}: ItemsQtdButtonsProps) => {
  const boxProps = { mt, mb, ml, mr };
  return (
    <Box {...boxProps}>
      {label && <Text>{label}</Text>}
      <Flex flexDir="row" alignItems="center">
        <Button
          maxW="48px"
          fontSize="3xl"
          variant="outline"
          aria-label={`${label ?? 'btn'}-minus`}
          onClick={decrement}
          {...props}
        >
          -
        </Button>
        <Text fontSize="md" mx="2">
          {value}
        </Text>
        <Button
          maxW="48px"
          fontSize="3xl"
          variant="outline"
          aria-label={`${label ?? 'btn'}-plus`}
          onClick={increment}
          {...props}
        >
          +
        </Button>
      </Flex>
    </Box>
  );
};
