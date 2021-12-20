import { Box, Flex, Switch, Text, Tooltip } from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { Complement, ComplementGroup, WithId } from 'appjusto-types';
import { CustomButton as Button } from 'common/components/buttons/CustomButton';
import { DropdownButton } from 'common/components/buttons/DropdownButton';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Link, useRouteMatch } from 'react-router-dom';
import { slugfyName } from 'utils/functions';
import { t } from 'utils/i18n';
import { ComplementItem } from './ComplementItem';

interface Props {
  group: WithId<ComplementGroup>;
  complements?: WithId<Complement>[];
  index: number;
  hidden?: boolean;
}

export const GroupItem = React.memo(({ group, complements, index, hidden }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { updateComplementsGroup } = useContextMenu();
  // state
  const [showComplements, setShowComplements] = React.useState(true);
  // helpers
  const itemsQtd = group.items?.length ?? 0;
  // side effects
  // UI
  return (
    <Draggable draggableId={group.id} index={index}>
      {(draggable) => (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          boxShadow="0px 8px 16px -4px rgba(105, 118, 103, 0.1)"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
          p="6"
          mb="6"
          d={hidden ? 'none' : 'block'}
          w="100%"
        >
          <Flex alignItems="center" mb="6">
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
                    }), máximo: (${group.maximum}), total de itens: (${itemsQtd})`
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
                      size="lg"
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
                <Tooltip placement="top" label={t('Editar')} aria-label={t('Editar')}>
                  <Link to={`${url}/complementsgroup/${group.id}`}>
                    <EditButton ml="2" title={t('Editar')} />
                  </Link>
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
          <Droppable droppableId={group.id} type="coplement">
            {(droppable, snapshot) => (
              <Box
                ref={droppable.innerRef}
                {...droppable.droppableProps}
                bg={snapshot.isDraggingOver ? 'gray.50' : 'white'}
                w="100%"
                overflow="auto"
                minH="15px"
              >
                {showComplements &&
                  complements &&
                  complements.map((complement, index) => (
                    <ComplementItem key={complement.id} complement={complement} index={index} />
                  ))}
                {droppable.placeholder}
              </Box>
            )}
          </Droppable>
          <Button
            mt="0"
            w={{ base: '100%', md: '260px' }}
            link={`${url}/complement/new?groupId=${group.id}`}
            label={t('Adicionar complemento')}
            aria-label={`adicionar-complemento-${slugfyName(group.name)}`}
            variant="outline"
          />
        </Box>
      )}
    </Draggable>
  );
});
