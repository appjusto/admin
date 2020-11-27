import { Box } from '@chakra-ui/react';
import { useCategories } from 'app/state/menu/categories';
import { useMenuConfigValue } from 'app/state/menu/config';
import { useGetProductsByCategoryId } from 'app/state/menu/products';
import { Product, WithId } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { CategoryItem } from './categories/CategoryItem';

interface Props {
  productSearch?: string;
}

export const Categories = ({ productSearch }: Props) => {
  // state
  const categories = useCategories();
  const getProductsByCategoryId = useGetProductsByCategoryId();
  const { updateCategoryIndex, updateProductIndex } = useMenuConfigValue();
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
              const products = filterProductsWithSearch(getProductsByCategoryId(category.id));
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
