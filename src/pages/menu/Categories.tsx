import { Box } from '@chakra-ui/react';
import { useMenu } from 'app/api/menu/useMenu';
import { useMenuConfigValue } from 'app/state/menu/config';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { CategoryItem } from './categories/CategoryItem';

export const Categories = () => {
  // state
  const { categories, getProductsByCategoryId } = useMenu();
  const { updateCategoryIndex, updateProductIndex } = useMenuConfigValue();

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
            {categories.map((category, index) => (
              <CategoryItem
                key={category.id}
                category={category}
                products={getProductsByCategoryId(category.id)}
                index={index}
              />
            ))}
            {droppable.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};
