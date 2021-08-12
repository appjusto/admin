import { Box } from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { useContextMenu } from 'app/state/menu/context';
import { isEmpty } from 'lodash';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { GroupItem } from './GroupItem';

interface Props {
  search?: string;
}

export const Complements = ({ search }: Props) => {
  // state
  const {
    sortedComplementsGroups,
    complementsOrdering,
    updateComplementsOrdering,
  } = useContextMenu();
  // handlers
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return; // dropped outside
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return; // same location
    if (type === 'coplement') {
      updateComplementsOrdering(
        menu.updateSecondLevelIndex(
          complementsOrdering,
          draggableId, //product id
          source.droppableId, // category from
          destination.droppableId, // category to
          source.index,
          destination.index
        )
      );
    } else if (type === 'group') {
      updateComplementsOrdering(
        menu.updateFirstLevelIndex(complementsOrdering, draggableId, destination.index)
      );
    }
  };

  // UI
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="categories" type="group">
        {(droppable) => (
          <Box ref={droppable.innerRef} {...droppable.droppableProps}>
            {sortedComplementsGroups.map((group, index) => {
              if (search) {
                const complements = menu.filterItemBySearch(group.items!, search);
                return (
                  <GroupItem
                    key={group.id}
                    group={group}
                    complements={complements}
                    index={index}
                    hidden={complements.length === 0 && !isEmpty(search)}
                  />
                );
              } else {
                return (
                  <GroupItem
                    key={group.id}
                    group={group}
                    complements={group.items}
                    index={index}
                    hidden={group.complements?.length === 0 && !isEmpty(search)}
                  />
                );
              }
            })}
            {droppable.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};
