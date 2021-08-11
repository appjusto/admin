import { Box } from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { useContextMenu } from 'app/state/menu/context';
import { isEmpty } from 'lodash';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useRouteMatch } from 'react-router-dom';
import { CategoryItem } from './CategoryItem';

interface Props {
  productSearch?: string;
}

export const Categories = ({ productSearch }: Props) => {
  // state
  const { categories, productsOrdering, updateProductsOrdering } = useContextMenu();
  const { url } = useRouteMatch();
  // handlers
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return; // dropped outside
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return; // same location
    if (type === 'product') {
      updateProductsOrdering(
        menu.updateSecondLevelIndex(
          productsOrdering,
          draggableId, //product id
          source.droppableId, // category from
          destination.droppableId, // category to
          source.index,
          destination.index
        )
      );
    } else if (type === 'category') {
      updateProductsOrdering(
        menu.updateFirstLevelIndex(productsOrdering, draggableId, destination.index)
      );
    }
  };

  // UI
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="categories" type="category">
        {(droppable) => (
          <Box ref={droppable.innerRef} {...droppable.droppableProps}>
            {categories.map((category, index) => {
              const products = menu.filterItemBySearch(category.items!, productSearch);
              return (
                <CategoryItem
                  url={url}
                  key={category.id}
                  category={category}
                  products={products}
                  index={index}
                  hidden={products.length === 0 && !isEmpty(productSearch)}
                />
              );
            })}
            {droppable.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};
