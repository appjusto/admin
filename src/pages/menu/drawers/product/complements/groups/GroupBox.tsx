import { ChevronDownIcon as Down, ChevronUpIcon as Up } from '@chakra-ui/icons';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { ComplementGroup } from 'appjusto-types';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { t } from 'utils/i18n';
import { GroupForm, NewGroup } from './GroupForm';

interface GroupBoxProps {
  group: ComplementGroup;
  updateGroup(newGroup: NewGroup): void;
}

export const GroupBox = ({ group, updateGroup }: GroupBoxProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showComplments, setShowComplements] = React.useState(false);
  return (
    <Box
      border="1px solid #F2F6EA"
      boxShadow="0px 8px 16px -4px rgba(105, 118, 103, 0.1)"
      borderRadius="lg"
      p="4"
      mt="4"
    >
      <Flex>
        <Flex alignItems="center" mr="4">
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
            <EditButton title="Editar" onClick={() => setIsEditing(true)} />
            <Button
              title="Adicionar complemento"
              ml="2"
              minW="30px"
              w="32px"
              h="32px"
              p="0"
              borderColor="#F2F6EA"
              //onClick={() => setShowComplements(!showComplments)}
            >
              +
            </Button>
            <Button
              title="Expandir"
              ml="2"
              minW="30px"
              w="32px"
              h="32px"
              p="0"
              variant="outline"
              borderColor="#F2F6EA"
              onClick={() => setShowComplements(!showComplments)}
            >
              {showComplments ? <Up /> : <Down />}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {isEditing && <GroupForm submitGroup={updateGroup} groupData={group} />}
    </Box>
  );
};
