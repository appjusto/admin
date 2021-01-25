import { Box } from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { GroupBox } from './GroupBox';

export const Groups = () => {
  const { productConfig, onSaveProduct, sortedGroups } = useProductContext();
  // handlers
  const onDragEndComplements = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return; // dropped outside
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return; // same location
    }
    let newProductConfig = menu.empty();
    if (type === 'group') {
      newProductConfig = menu.updateCategoryIndex(productConfig, draggableId, destination.index);
    } else if (type === 'item') {
      newProductConfig = menu.updateProductIndex(
        productConfig,
        draggableId,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
    onSaveProduct({ complementsOrder: newProductConfig }, null, undefined);
  };

  // UI
  return (
    <DragDropContext onDragEnd={onDragEndComplements}>
      <Droppable droppableId="groups" type="group">
        {(droppable) => (
          <Box ref={droppable.innerRef} {...droppable.droppableProps}>
            {sortedGroups.map((group, index) => (
              <GroupBox key={group.name} index={index} group={group} />
            ))}
            {droppable.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};
