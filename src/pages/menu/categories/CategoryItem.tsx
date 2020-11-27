import { Box, Flex, Heading, Spacer, Switch } from '@chakra-ui/react';
import { useCategory } from 'app/api/menu/categories/useCategory';
import { Category, Product, WithId } from 'appjusto-types';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Link, useRouteMatch } from 'react-router-dom';
import { ProductItem } from '../ProductItem';

interface Props {
  category: WithId<Category>;
  products: WithId<Product>[];
  index: number;
  hidden?: boolean;
}

export const CategoryItem = React.memo(({ category, products, index, hidden }: Props) => {
  // context
  const { url } = useRouteMatch();

  // mutations
  const { updateCategory } = useCategory(category.id);

  // UI
  return (
    <Draggable draggableId={category.id} index={index}>
      {(draggable) => (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
          p="6"
          mb="6"
          d={hidden ? 'none' : 'block'}
        >
          <Flex alignItems="center" mb="6">
            <Box bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
              <DragHandle />
            </Box>
            <Heading fontSize="3xl" ml="4">
              {category.name}
            </Heading>
            <Spacer />
            <Switch
              isChecked={category.enabled}
              onChange={(ev) => {
                ev.stopPropagation();
                updateCategory({ enabled: ev.target.checked });
              }}
            />
            <Link to={`${url}/category/${category.id}`}>
              <EditButton />
            </Link>
          </Flex>
          <Droppable droppableId={category.id} type="product">
            {(droppable, snapshot) => (
              <Box
                ref={droppable.innerRef}
                {...droppable.droppableProps}
                bg={snapshot.isDraggingOver ? 'gray.50' : 'white'}
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
