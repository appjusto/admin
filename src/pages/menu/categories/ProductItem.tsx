import { Box, Flex, Image, Spacer, Switch, Text } from '@chakra-ui/react';
import { useProductImageURL } from 'app/api/business/products/useProductImageURL';
import { useProductUpdate } from 'app/api/business/products/useProductUpdate';
import { Product, WithId } from 'appjusto-types';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link, useRouteMatch } from 'react-router-dom';

interface Props {
  product: WithId<Product>;
  index: number;
}

export const ProductItem = React.memo(({ product, index }: Props) => {
  // context
  const { url } = useRouteMatch();

  // queries
  const { data: image } = useProductImageURL(product.id);

  // mutations
  const { updateProduct } = useProductUpdate(product.id);

  // UI
  return (
    <Draggable draggableId={product.id} index={index}>
      {(draggable, snapshot) => (
        <Flex
          bg="white"
          mb="4"
          borderWidth="1px"
          borderRadius="lg"
          alignItems="center"
          p="2"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
        >
          <Box bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
            <DragHandle />
          </Box>
          <Link to={`${url}/product/${product.id}`}>
            <Image
              marginX="4"
              src={image ?? undefined}
              fallbackSrc="/static/media/product-placeholder.png"
              boxSize="24"
              objectFit="contain"
              borderRadius="8px"
              alt="Product image"
            />
          </Link>
          <Box bg="white">
            <Text fontSize="lg" fontWeight="700">
              {product.name}
            </Text>
            <Text fontSize="sm">{product.description}</Text>
          </Box>
          <Spacer />
          <Switch
            isChecked={product.enabled}
            onChange={(ev) => {
              ev.stopPropagation();
              updateProduct({ enabled: ev.target.checked });
            }}
          />

          <Link to={`${url}/product/${product.id}`}>
            <EditButton />
          </Link>
        </Flex>
      )}
    </Draggable>
  );
});
