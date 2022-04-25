import { Box, Button, HStack, RadioGroup, Td, Tr } from '@chakra-ui/react';
import { ManagerWithPermissions } from 'app/api/manager/types';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import { formatDate, formatTime } from 'utils/formatters';
import { t } from 'utils/i18n';
import { getBusinessManagerBasicRole, ManagerBasicRole } from './utils';

interface TeamTableItemProps {
  manager: ManagerWithPermissions;
  updateMember(managerEmail: string, role: ManagerBasicRole): void;
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
  const [role, setRole] = React.useState<ManagerBasicRole>();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  // side effects
  React.useEffect(() => {
    if (!manager.permissions) return;
    console.log('Permissions', manager.permissions);
    const basicRole = getBusinessManagerBasicRole(manager.permissions);
    console.log('basicRole', basicRole);
    setRole(basicRole);
  }, [manager.permissions, getBusinessManagerBasicRole]);
  // UI
  if (isDeleting) {
    return (
      <Tr color="black" fontSize="sm" h="66px" bg="rgba(254, 215, 215, 0.3)" pos="relative">
        <Td>{manager.email}</Td>
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
      </Tr>
    );
  } else if (isUpdating) {
    return (
      <Tr color="black" fontSize="sm" h="66px" pos="relative">
        <Td>{manager.email}</Td>
        <Td>{t('Confirmar atualização?')}</Td>
        <Td position="relative">
          <Box position="absolute" top="4">
            <HStack spacing={4}>
              <Button w="150px" size="sm" variant="danger" onClick={() => setIsUpdating(false)}>
                {t('Cancelar')}
              </Button>
              <Button
                w="150px"
                size="sm"
                onClick={() => updateMember(manager.email, role!)}
                isLoading={isLoading}
              >
                {t('Atualizar')}
              </Button>
            </HStack>
          </Box>
        </Td>
        <Td></Td>
      </Tr>
    );
  }
  return (
    <Tr
      color="black"
      fontSize="sm"
      h="66px"
      bg={isDeleting ? 'rgba(254, 215, 215, 0.3)' : 'none'}
      pos="relative"
    >
      <Td>{manager.email}</Td>
      <Td textAlign="center">
        <RadioGroup
          onChange={(value: ManagerBasicRole) => setRole(value)}
          value={role}
          defaultValue="1"
          colorScheme="green"
          color="black"
          fontSize="15px"
          lineHeight="21px"
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <CustomRadio value="owner">{t('Proprietário')}</CustomRadio>
            <CustomRadio value="manager">{t('Gerente')}</CustomRadio>
            <CustomRadio value="collaborator">{t('Colaborador')}</CustomRadio>
          </HStack>
        </RadioGroup>
      </Td>
      <Td>
        {formatDate(manager.createdOn as unknown as Date) +
          ' - ' +
          formatTime(manager.createdOn as unknown as Date)}
      </Td>
      <Td>
        <Button size="sm" minW="160px" variant="dangerLight" onClick={() => setIsDeleting(true)}>
          {t('Excluir colaborador')}
        </Button>
      </Td>
    </Tr>
  );
};
