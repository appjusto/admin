import { Box, Button, HStack, Switch, Td, Tr } from '@chakra-ui/react';
import { ManagerWithRole } from 'app/api/manager/types';
import React from 'react';
import { formatDate, formatTime } from 'utils/formatters';
import { t } from 'utils/i18n';

interface TeamTableItemProps {
  manager: ManagerWithRole;
  updateMember(managerEmail: string, isManager: boolean): void;
  deleteMember(managerEmail: string): void;
  isLoading: boolean;
}

export const TeamTableItem = ({
  manager,
  updateMember,
  deleteMember,
  isLoading,
}: TeamTableItemProps) => {
  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
  // UI
  return (
    <Tr
      color="black"
      fontSize="sm"
      h="66px"
      bg={isDeleting ? 'rgba(254, 215, 215, 0.3)' : 'none'}
      pos="relative"
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
                  onClick={() => deleteMember(manager.email)}
                  isLoading={isLoading}
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
                updateMember(manager.email, ev.target.checked);
              }}
            />
          </Td>
          <Td>
            {formatDate((manager.createdOn as unknown) as Date) +
              ' - ' +
              formatTime((manager.createdOn as unknown) as Date)}
          </Td>
          <Td>
            <Button
              size="sm"
              minW="160px"
              variant="dangerLight"
              onClick={() => setIsDeleting(true)}
            >
              {t('Excluir colaborador')}
            </Button>
          </Td>
        </>
      )}
    </Tr>
  );
};
