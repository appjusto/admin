import { Box } from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { useContextMenu } from 'app/state/menu/context';
import { isEmpty } from 'lodash';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import { GroupItem } from './GroupItem';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

interface Props {
  search?: string;
}

export const Complements = ({ search }: Props) => {
  // context
  const query = useQuery();
  // helpers
  const groupQuery = query.get('group');
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
  React.useEffect(() => {
    if (!groupQuery) return;
    const element = document.getElementById(groupQuery);
    if (element) element.scrollIntoView();
  }, [groupQuery]);
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
                    hidden={group.items?.length === 0 && !isEmpty(search)}
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
