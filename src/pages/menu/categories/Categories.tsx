import { Box } from '@chakra-ui/react';
import { useOrderedMenu } from 'app/api/business/menu/useOrderedMenu';
import { useBusinessId } from 'app/state/business/context';
import { useContextMenuConfig } from 'app/state/menu/config';
import { Product, WithId } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { CategoryItem } from './CategoryItem';

interface Props {
  productSearch?: string;
}

export const Categories = ({ productSearch }: Props) => {
  // state
  const businessId = useBusinessId();
  const categories = useOrderedMenu(businessId);
  const { updateCategoryIndex, updateProductIndex } = useContextMenuConfig();
  const filterProductsWithSearch = (products: WithId<Product>[]) => {
    if (!productSearch || isEmpty(productSearch)) return products;
    const regexp = new RegExp(productSearch, 'i');
    return products.filter((product) => regexp.test(product.name));
  };

  // handlers
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return; // dropped outside
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return; // same location
    if (type === 'product') {
      updateProductIndex(
        draggableId,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    } else if (type === 'category') {
      updateCategoryIndex(draggableId, destination.index);
    }
  };

  // UI
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="categories" type="category">
        {(droppable) => (
          <Box ref={droppable.innerRef} {...droppable.droppableProps}>
            {categories.map((category, index) => {
              const products = filterProductsWithSearch(category.products);
              return (
                <CategoryItem
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
