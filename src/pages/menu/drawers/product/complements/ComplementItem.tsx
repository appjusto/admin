import { Box, Flex, Text } from '@chakra-ui/react';
import { Complement, WithId } from 'appjusto-types';
import { DeleteButton } from 'common/components/buttons/DeleteButton';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ComplementForm } from './ComplementForm';

interface Props {
  item: WithId<Complement>;
  index: number;
}

export const ComplementItem = ({ item, index, ...props }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  return (
    <Draggable draggableId={item.id} index={index}>
      {(draggable, snapshot) => (
        <Flex
          bg="white"
          mb="4"
          borderWidth="1px"
          borderRadius="lg"
          alignItems="center"
          p="2"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
        >
          {isEditing ? (
            <ComplementForm
              complementId={item.id}
              item={item}
              onSuccess={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <Box bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
                <DragHandle />
              </Box>
              <Flex w="100%" justifyContent="space-between" px="6">
                <Box bg="white" mr="2">
                  <Text fontSize="sm" fontWeight="bold">
                    {item.name}
                  </Text>
                  <Text fontSize="xs">{item.description}</Text>
                </Box>
                <Flex maxW="120px" alignItems="center" justifyContent="flex-end">
                  <Text fontSize="xs">{item.price}</Text>
                  <EditButton onClick={() => setIsEditing(!isEditing)} />
                  <DeleteButton />
                </Flex>
              </Flex>
            </>
          )}
        </Flex>
      )}
    </Draggable>
  );
};
