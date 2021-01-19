import { Box } from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { ComplementGroup, MenuConfig, WithId } from 'appjusto-types';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { GroupBox } from './GroupBox';

interface Params {
  productId: string;
}

interface Props {
  groups: WithId<ComplementGroup>[];
  productConfig: MenuConfig;
  onUpdateGroup(groupId: string, changes: Partial<ComplementGroup>): Promise<void>;
  onDeleteGroup(groupId: string): Promise<void>;
}

export const Groups = ({ groups, productConfig, onUpdateGroup, onDeleteGroup }: Props) => {
  const api = useContextApi();
  const { productId } = useParams<Params>();
  const businessId = useContextBusinessId();
  // handlers
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return; // dropped outside
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return; // same location
    }
    const newProductConfig = menu.updateCategoryIndex(
      productConfig,
      draggableId,
      destination.index
    );
    api.business().updateProduct(businessId!, productId, {
      complementsOrder: newProductConfig,
    });
  };
  // UI
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="groups" type="group">
        {(droppable) => (
          <Box ref={droppable.innerRef} {...droppable.droppableProps}>
            {groups.map((group, index) => (
              <GroupBox
                key={group.name}
                index={index}
                group={group}
                onUpdateGroup={onUpdateGroup}
                onDeleteGroup={onDeleteGroup}
              />
            ))}
            {droppable.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};
