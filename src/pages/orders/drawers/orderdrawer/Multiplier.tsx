import { Text } from '@chakra-ui/react';
import React from 'react';

interface MultiplierProps {
  products: number;
  complements: number;
}

export const Multiplier = ({ products, complements }: MultiplierProps) => {
  return (
    <Text>
      {products}
      <Text as="span" color="green.700">
        x
      </Text>{' '}
      {complements}
    </Text>
  );
};
