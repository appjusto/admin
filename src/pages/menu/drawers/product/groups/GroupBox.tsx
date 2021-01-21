import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { ComplementGroup, WithId } from 'appjusto-types';
import { AddButton } from 'common/components/buttons/AddButton';
import { DeleteButton } from 'common/components/buttons/DeleteButton';
import { DropdownButton } from 'common/components/buttons/DropdownButton';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { t } from 'utils/i18n';
import { ComplementForm } from '../complements/ComplementForm';
import { ComplementItem } from '../complements/ComplementItem';
import { GroupForm, NewGroup } from './GroupForm';

interface GroupBoxProps {
  index: number;
  group: WithId<ComplementGroup>;
}

export const GroupBox = ({ index, group }: GroupBoxProps) => {
  //context
  const {
    onUpdateComplementsGroup,
    onDeleteComplementsGroup,
    onDeleteComplement,
  } = useProductContext();
  //state
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showComplments, setShowComplements] = React.useState(false);

  React.useEffect(() => {
    if (group.items && group.items?.length > 0) {
      setShowComplements(true);
    }
  }, [group]);

  const handleUpdate = (groupData: NewGroup) => {
    setIsLoading(true);
    onUpdateComplementsGroup(group.id, groupData);
    setIsLoading(false);
  };

  const handleDeleteGroup = () => {
    setIsLoading(true);
    onDeleteComplementsGroup(group.id);
  };

  const handleDeleteComplement = (complementId: string) => {
    setIsLoading(true);
    onDeleteComplement(complementId, group.id);
  };

  if (isDeleting) {
    return (
      <Box
        border="1px solid #F2F6EA"
        boxShadow="0px 8px 16px -4px rgba(105, 118, 103, 0.1)"
        borderRadius="lg"
        p="4"
        mt="4"
      >
        <Flex flexDir="column" p="4" bg="#FFF8F8">
          <Text textAlign="center">
            {t(`Tem certeza que deseja apagar o grupo `)}
            <Text as="span" fontWeight="700">
              "{group.name}"?
            </Text>
          </Text>
          <HStack mt="4" spacing={4} justifyContent="center">
            <Button size="sm" w="220px" onClick={() => setIsDeleting(false)}>
              {t('Manter')}
            </Button>
            <Button
              size="sm"
              w="220px"
              variant="danger"
              onClick={handleDeleteGroup}
              isLoading={isLoading}
              loadingText={t('Apagando')}
            >
              {t('Apagar')}
            </Button>
          </HStack>
        </Flex>
      </Box>
    );
  }

  return (
    <Draggable draggableId={group.id} index={index}>
      {(draggable) => (
        <Box
          border="1px solid #F2F6EA"
          boxShadow="0px 8px 16px -4px rgba(105, 118, 103, 0.1)"
          borderRadius="lg"
          p="4"
          mt="4"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
        >
          <Flex>
            <Flex
              alignItems="center"
              mr="4"
              {...draggable.dragHandleProps}
              ref={draggable.innerRef}
            >
              <DragHandle />
            </Flex>
            <Flex w="100%" flexDir="row" justifyContent="space-between">
              <Flex flexDir="column">
                <Text fontSize="xl" color="black">
                  {group.name}
                </Text>
                <Text fontSize="sm" color="grey.700">
                  {t(
                    `${group.required ? 'Obrigatório' : 'Opcional'}, mínimo: (${
                      group.minimum
                    }), máximo: (${group.maximum})`
                  )}
                </Text>
              </Flex>
              <Flex flexDir="row" alignItems="center">
                <AddButton title={t('Adicionar item')} onClick={() => setIsAdding(!isAdding)} />
                <EditButton title={t('Editar')} onClick={() => setIsEditing(!isEditing)} />
                <DeleteButton
                  title={t('Excluir grupo')}
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                    }
                    setIsDeleting(true);
                  }}
                />
                <DropdownButton
                  title={t('Expandir')}
                  isExpanded={showComplments}
                  onClick={() => setShowComplements(!showComplments)}
                />
              </Flex>
            </Flex>
          </Flex>
          {isEditing && (
            <GroupForm
              submitGroup={handleUpdate}
              groupData={group}
              isLoading={isLoading}
              onSuccess={() => setIsEditing(false)}
            />
          )}
          {isAdding && (
            <ComplementForm
              groupId={group.id}
              onSuccess={() => setIsAdding(false)}
              onCancel={() => setIsAdding(false)}
            />
          )}
          {showComplments && (
            <Droppable droppableId={group.id} type="item">
              {(droppable, snapshot) => (
                <Box
                  ref={droppable.innerRef}
                  {...droppable.droppableProps}
                  bg={snapshot.isDraggingOver ? 'gray.50' : 'white'}
                  minH="30px"
                  mt="4"
                >
                  {group.items &&
                    group.items.map((item, index) => (
                      <ComplementItem
                        key={item.id}
                        item={item}
                        index={index}
                        isLoading={isLoading}
                        handleDelete={handleDeleteComplement}
                      />
                    ))}
                  {droppable.placeholder}
                </Box>
              )}
            </Droppable>
          )}
        </Box>
      )}
    </Draggable>
  );
};
