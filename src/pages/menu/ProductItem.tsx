import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Product, WithId } from 'appjusto-types';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface Props {
  product: WithId<Product>;
  index: number;
}

export const ProductItem = React.memo(({ product, index }: Props) => {
  return (
    <Draggable draggableId={product.id} index={index}>
      {(draggable, snapshot) => (
        <Flex
          bg={snapshot.isDragging ? 'gray.500' : 'white'}
          mb="4"
          borderWidth="1px"
          borderRadius="lg"
          alignItems="center"
          p="2"
          {...draggable.draggableProps}
        >
          <Box bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
            <DragHandle />
          </Box>
          <Image
            ml="4"
            src="https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/12/Shakshuka-19-500x375.jpg"
            fallbackSrc="https://via.placeholder.com/96"
            boxSize="24"
            objectFit="contain"
            borderRadius="full"
            alt="Product image"
          />
          <Box bg="white" ml="4">
            <Text fontSize="lg" fontWeight="700">
              {product.name}
            </Text>
            <Text fontSize="xs">{product.name}</Text>
          </Box>
        </Flex>
      )}
    </Draggable>
  );
});
