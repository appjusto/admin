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
import { ComplementForm } from '../../../complements/ComplementForm';

interface Props {
  groupId: string;
  groupMaximum?: number;
  item: WithId<Complement>;
  index: number;
  description?: boolean;
}

export const ComplementItem = ({
  groupId,
  groupMaximum,
  item,
  index,
  description = false,
}: Props) => {
  // context
  const { updateComplement, updateComplementResult, deleteComplement } = useProductContext();
  const { isLoading } = updateComplementResult;
  // state
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const handleUpdate = <K extends keyof WithId<Complement>>(value: boolean) => {
    let newItem = {} as Complement;
    const keys = Object.keys(item) as K[];
    keys.forEach((key) => {
      //@ts-ignore
      if (key !== 'id') newItem[key] = item[key];
    });
    updateComplement({
      groupId,
      complementId: item.id,
      changes: { ...newItem, enabled: value },
    });
  };
  // UI
  if (isEditing) {
    return (
      <Flex bg="white" mb="4" borderWidth="1px" borderRadius="lg" alignItems="center" p="2">
        <ComplementForm
          groupMaximum={groupMaximum}
          complementId={item.id}
          item={item}
          updateComplement={updateComplement}
          updateComplementResult={updateComplementResult}
          onSuccess={() => setIsEditing(false)}
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
              onClick={() =>
                deleteComplement({
                  complementId: item.id,
                  groupId,
                  imageExists: item.imageExists ?? false,
                })
              }
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
              {description && (
                <Text ml="4" fontSize="xs">
                  {item.description}
                </Text>
              )}
            </Flex>
            <Flex maxW="220px" alignItems="center" justifyContent="flex-end">
              <Text fontSize="xs" fontWeight="700" mr="4">
                {formatCurrency(item.price)}
              </Text>
              <Tooltip
                key="available"
                placement="top"
                label={t('Disponibilidade do item')}
                aria-label={t('Disponibilidade do item')}
              >
                <Box>
                  <Switch
                    size="md"
                    isChecked={item.enabled}
                    onChange={(ev) => {
                      ev.stopPropagation();
                      // update
                      handleUpdate(ev.target.checked);
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
