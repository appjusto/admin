import { Box, Button, Flex, HStack, Switch, Text, Tooltip } from '@chakra-ui/react';
import { ComplementGroup, WithId } from 'appjusto-types';
import { AddButton } from 'common/components/buttons/AddButton';
import { DeleteButton } from 'common/components/buttons/DeleteButton';
import { DropdownButton } from 'common/components/buttons/DropdownButton';
import { EditButton } from 'common/components/buttons/EditButton';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { t } from 'utils/i18n';
import { ComplementForm } from '../complements/ComplementForm';
import { ComplementItem } from '../complements/ComplementItem';
import { GroupForm } from './GroupForm';

interface GroupBoxProps {
  index: number;
  group: WithId<ComplementGroup>;
}

export const GroupBox = ({ index, group }: GroupBoxProps) => {
  //context
  const {
    updateComplementsGroup,
    updateGroupResult,
    deleteComplementsGroup,
    deleteGroupResult,
  } = useProductContext();
  const { isLoading, isError, error: deleteError } = deleteGroupResult;
  //state
  const [isEditing, setIsEditing] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showComplements, setShowComplements] = React.useState(false);
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
  // handlers
  const handleDeleteGroup = () => {
    setError(initialError);
    submission.current += 1;
    deleteComplementsGroup(group.id);
  };
  // side effects
  React.useEffect(() => {
    if (group.items && group.items?.length > 0) {
      setShowComplements(true);
    }
  }, [group]);
  React.useEffect(() => {
    if (isError) {
      setError({
        status: true,
        error: deleteError,
      });
    } else if (updateGroupResult.isError) {
      setError({
        status: true,
        error: updateGroupResult.error,
      });
    }
  }, [isError, deleteError, updateGroupResult.isError, updateGroupResult.error]);
  // UI
  return (
    <Box>
      {isDeleting ? (
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
      ) : (
        <Draggable draggableId={group.id} index={index}>
          {(draggable) => (
            <Box
              border="1px solid #F2F6EA"
              boxShadow="0px 8px 16px -4px rgba(105, 118, 103, 0.1)"
              borderRadius="lg"
              p="4"
              mt="4"
              minW="500px"
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
                    <Tooltip
                      key="available"
                      placement="top"
                      label={t('Disponibilidade do grupo')}
                      aria-label={t('Disponibilidade do grupo')}
                    >
                      <Box>
                        <Switch
                          size="md"
                          isChecked={group.enabled}
                          onChange={(ev) => {
                            ev.stopPropagation();
                            // update
                            updateComplementsGroup({
                              groupId: group.id,
                              changes: { ...group, enabled: ev.target.checked },
                            });
                          }}
                        />
                      </Box>
                    </Tooltip>
                    <Tooltip
                      placement="top"
                      label={t('Adicionar item')}
                      aria-label={t('Adicionar item')}
                    >
                      <AddButton onClick={() => setIsAdding(!isAdding)} />
                    </Tooltip>
                    <Tooltip placement="top" label={t('Editar')} aria-label={t('Editar')}>
                      <EditButton
                        ml="2"
                        title={t('Editar')}
                        onClick={() => setIsEditing(!isEditing)}
                      />
                    </Tooltip>
                    <Tooltip
                      placement="top"
                      label={t('Excluir grupo')}
                      aria-label={t('Excluir grupo')}
                    >
                      <DeleteButton
                        title={t('Excluir grupo')}
                        onClick={() => {
                          if (isEditing) {
                            setIsEditing(false);
                          }
                          setIsDeleting(true);
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      placement="top"
                      label={showComplements ? t('Recolher') : t('Expandir')}
                      aria-label={showComplements ? t('Recolher') : t('Expandir')}
                    >
                      <DropdownButton
                        title={t('Expandir')}
                        isExpanded={showComplements}
                        onClick={() => setShowComplements(!showComplements)}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
              </Flex>
              {isEditing && <GroupForm groupData={group} onSuccess={() => setIsEditing(false)} />}
              {isAdding && (
                <ComplementForm
                  groupId={group.id}
                  groupMaximum={group.maximum}
                  onSuccess={() => setIsAdding(false)}
                  onCancel={() => setIsAdding(false)}
                />
              )}
              {showComplements && (
                <Droppable droppableId={group.id} type="item">
                  {(droppable, snapshot) => (
                    <Box
                      ref={droppable.innerRef}
                      {...droppable.droppableProps}
                      bg={snapshot.isDraggingOver ? 'gray.50' : 'white'}
                      minH={100}
                      mt="4"
                    >
                      {group.items &&
                        group.items.map((item, index) => (
                          <ComplementItem
                            key={item.id}
                            groupId={group.id}
                            groupMaximum={group.maximum}
                            item={item}
                            index={index}
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
      )}
      <SuccessAndErrorHandler
        submission={submission.current}
        //isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </Box>
  );
};
