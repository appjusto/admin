import { Box, Button, HStack, Switch, Td, Tr } from '@chakra-ui/react';
import { BusinessManager } from 'app/api/manager/types';
import { WithId } from 'appjusto-types';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface TeamTableItemProps {
  manager: WithId<BusinessManager>;
  updateMember(managerId: string, isManager: boolean): void;
  deleteMember(managerId: string): void;
}

export const TeamTableItem = ({ manager, updateMember, deleteMember }: TeamTableItemProps) => {
  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
  // handlers

  // UI
  return (
    <Tr
      key={manager.email}
      color="black"
      fontSize="sm"
      h="66px"
      bg={isDeleting ? 'rgba(254, 215, 215, 0.3)' : 'none'}
    >
      <Td>{manager.email}</Td>
      {isDeleting ? (
        <>
          <Td>{t('Confirmar exclusão?')}</Td>
          <Td position="relative">
            <Box position="absolute" top="4">
              <HStack spacing={4}>
                <Button w="150px" size="sm" onClick={() => setIsDeleting(false)}>
                  {t('Manter')}
                </Button>
                <Button
                  w="150px"
                  size="sm"
                  variant="danger"
                  onClick={() => deleteMember(manager.id)}
                >
                  {t('Excluir')}
                </Button>
              </HStack>
            </Box>
          </Td>
          <Td></Td>
        </>
      ) : (
        <>
          <Td textAlign="center">
            <Switch
              isChecked={manager.role === 'manager'}
              onChange={(ev) => {
                ev.stopPropagation();
                updateMember(manager.id, ev.target.checked);
              }}
            />
          </Td>
          <Td>{getDateAndHour(manager.createdOn as firebase.firestore.Timestamp)}</Td>
          <Td>
            <Button size="sm" variant="dangerLight" onClick={() => setIsDeleting(true)}>
              {t('Excluir colaborador')}
            </Button>
          </Td>
        </>
      )}
    </Tr>
  );
};
