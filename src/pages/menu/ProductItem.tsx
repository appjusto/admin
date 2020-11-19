import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Product } from 'appjusto-types';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';

interface Props {
  product: Product;
}

export const ProductItem = ({ product }: Props) => {
  return (
    <Flex borderRadius="lg" alignItems="center">
      <DragHandle />
      <Image
        src="https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/12/Shakshuka-19-500x375.jpg"
        fallbackSrc="https://via.placeholder.com/96"
        boxSize="24"
        objectFit="contain"
        borderRadius="full"
        alt="Product image"
      />
      <Box>
        <Text fontSize="lg" fontWeight="700">
          {product.name}
        </Text>
        <Text fontSize="xs">{product.name}</Text>
      </Box>
    </Flex>
  );
};
