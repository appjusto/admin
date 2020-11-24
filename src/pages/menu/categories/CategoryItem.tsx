import { Box, Flex, Heading, Spacer, Switch } from '@chakra-ui/react';
import { useApi } from 'app/api/context';
import { useBusinessId } from 'app/state/business/context';
import { Category, Product, WithId } from 'appjusto-types';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ProductItem } from '../ProductItem';

interface Props {
  category: WithId<Category>;
  products: WithId<Product>[];
  index: number;
}

export const CategoryItem = React.memo(({ category, products, index }: Props) => {
  const api = useApi()!;
  const businessId = useBusinessId()!;

  return (
    <Draggable draggableId={category.id} index={index}>
      {(draggable) => (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
          p="6"
          mb="6"
        >
          <Flex alignItems="center" mb="6">
            <Box bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
              <DragHandle />
            </Box>
            <Heading ml="4">{category.name}</Heading>
            <Spacer />
            <Switch
              isChecked={category.enabled}
              onChange={(ev) => {
                ev.stopPropagation();
                api.menu().updateCategory(businessId, category.id, { enabled: ev.target.checked });
              }}
            />
          </Flex>
          <Droppable droppableId={category.id} type="product">
            {(droppable, snapshot) => (
              <Box
                ref={droppable.innerRef}
                {...droppable.droppableProps}
                bg={snapshot.isDraggingOver ? 'gray.500' : 'white'}
                minH={100}
              >
                {products &&
                  products.map((product, index) => (
                    <ProductItem key={product.id} product={product} index={index} />
                  ))}
                {droppable.placeholder}
              </Box>
            )}
          </Droppable>
        </Box>
      )}
    </Draggable>
  );
});
