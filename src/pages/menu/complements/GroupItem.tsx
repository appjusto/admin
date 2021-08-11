import { Box, Flex, Heading, Spacer, Switch, Tooltip } from '@chakra-ui/react';
import { useCategory } from 'app/api/business/categories/useCategory';
import { Complement, ComplementGroup, WithId } from 'appjusto-types';
import { CustomButton as Button } from 'common/components/buttons/CustomButton';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { t } from 'utils/i18n';
import { ComplementItem } from './ComplementItem';

interface Props {
  group: WithId<ComplementGroup>;
  complements?: WithId<Complement>[];
  index: number;
  hidden?: boolean;
  url: string;
}

export const GroupItem = React.memo(({ group, complements, index, hidden, url }: Props) => {
  // context
  //const { url } = useRouteMatch();
  // mutations
  const { updateCategory } = useCategory(group.id);
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
            <Box bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
              <DragHandle />
            </Box>
            <Heading fontSize="3xl" ml="4">
              {group.name}
            </Heading>
            <Spacer />
            <Switch
              isChecked={group.enabled}
              onChange={(ev) => {
                ev.stopPropagation();
                updateCategory({ enabled: ev.target.checked });
              }}
            />
            <Link to={`${url}/category/${group.id}`}>
              <Tooltip placement="top" label={t('Editar')} aria-label={t('Editar')}>
                <EditButton />
              </Tooltip>
            </Link>
          </Flex>
          <Droppable droppableId={group.id} type="product">
            {(droppable, snapshot) => (
              <Box
                ref={droppable.innerRef}
                {...droppable.droppableProps}
                bg={snapshot.isDraggingOver ? 'gray.50' : 'white'}
                minH={100}
                w="100%"
                overflow="auto"
              >
                {complements &&
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
            link={`${url}/product/new?categoryId=${group.id}`}
            label={t('Adicionar complemento')}
            variant="outline"
          />
        </Box>
      )}
    </Draggable>
  );
});
