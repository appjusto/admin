import { OrderFlag } from '@appjusto/types';
import { Box, BoxProps } from '@chakra-ui/react';

interface OrderBaseCardProps extends BoxProps {
  flags?: OrderFlag[];
}

export const OrderBaseCard = ({ flags, ...props }: OrderBaseCardProps) => {
  return (
    <Box
      position="relative"
      borderRadius="lg"
      {...props}
      // boxShadow="0px 1px 12px -2px #ff4d00"
    >
      {/* <OrderIssuesAlert flags={flags} /> */}
      {props.children}
    </Box>
  );
};
