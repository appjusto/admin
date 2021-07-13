import { Box, Button, Flex, HStack, Switch, Text, Tooltip } from '@chakra-ui/react';
import { Complement, WithId } from 'appjusto-types';
import { DeleteButton } from 'common/components/buttons/DeleteButton';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { ComplementForm } from './ComplementForm';

interface Props {
  groupId: string;
  item: WithId<Complement>;
  index: number;
  isLoading: boolean;
  handleDelete(complementId: string, imageExists: boolean): void;
}

export const ComplementItem = ({ groupId, item, index, isLoading, handleDelete }: Props) => {
  // context
  const { onUpdateComplement } = useProductContext();
  // state
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  // UI
  if (isEditing) {
    return (
      <Flex bg="white" mb="4" borderWidth="1px" borderRadius="lg" alignItems="center" p="2">
        <ComplementForm
          complementId={item.id}
          item={item}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </Flex>
    );
  }

  if (isDeleting) {
    return (
      <Flex bg="white" mb="4" borderWidth="1px" borderRadius="lg" alignItems="center" p="2">
        <Flex flexDir="column" p="4" bg="#FFF8F8">
          <Text textAlign="center">
            {t(`Tem certeza que deseja apagar o complemento `)}
            <Text as="span" fontWeight="700">
              "{item.name}"?
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
              onClick={() => handleDelete(item.id, item.imageExists ?? false)}
              isLoading={isLoading}
              loadingText={t('Apagando')}
            >
              {t('Apagar')}
            </Button>
          </HStack>
        </Flex>
      </Flex>
    );
  }
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
          <Box bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
            <DragHandle />
          </Box>
          <Flex w="100%" justifyContent="space-between" px="6">
            <Flex bg="white" mr="2" alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                {item.name}
              </Text>
              <Text fontSize="xs">{item.description}</Text>
            </Flex>
            <Flex maxW="220px" alignItems="center" justifyContent="flex-end">
              <Text fontSize="xs" fontWeight="700" mr="4">
                {formatCurrency(item.price)}
              </Text>
              <Tooltip
                key="available"
                placement="top"
                label={t('Disponibilidade')}
                aria-label={t('Disponibilidade')}
              >
                <Box>
                  <Switch
                    size="md"
                    isChecked={item.enabled}
                    onChange={(ev) => {
                      ev.stopPropagation();
                      // update
                      onUpdateComplement(item.id, { enabled: ev.target.checked }, null);
                    }}
                  />
                </Box>
              </Tooltip>
              <Tooltip key="editing" placement="top" label={t('Editar')} aria-label={t('Editar')}>
                <EditButton onClick={() => setIsEditing(true)} ml="2" />
              </Tooltip>
              <Tooltip key="remove" placement="top" label={t('Excluir')} aria-label={t('Excluir')}>
                <DeleteButton onClick={() => setIsDeleting(true)} />
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Draggable>
  );
};
