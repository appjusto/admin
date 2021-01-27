import { Box } from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { useContextMenu } from 'app/state/menu/context';
import { Product, WithId } from 'appjusto-types';
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
  const { categories, ordering, updateMenuOrdering } = useContextMenu();
  const filterProductsWithSearch = (products: WithId<Product>[]) => {
    if (!productSearch || isEmpty(productSearch)) return products;
    const regexp = new RegExp(productSearch, 'i');
    return products.filter((product) => regexp.test(product.name));
  };
  const { url } = useRouteMatch();
  // handlers
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return; // dropped outside
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return; // same location
    if (type === 'product') {
      updateMenuOrdering(
        menu.updateSecondLevelIndex(
          ordering,
          draggableId, //product id
          source.droppableId, // category from
          destination.droppableId, // category to
          source.index,
          destination.index
        )
      );
    } else if (type === 'category') {
      updateMenuOrdering(menu.updateFirstLevelIndex(ordering, draggableId, destination.index));
    }
  };

  // UI
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="categories" type="category">
        {(droppable) => (
          <Box ref={droppable.innerRef} {...droppable.droppableProps}>
            {categories.map((category, index) => {
              const products = filterProductsWithSearch(category.items!);
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
