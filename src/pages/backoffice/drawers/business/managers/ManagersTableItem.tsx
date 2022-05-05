import { AdminRole } from '@appjusto/types';
import { Box, Button, HStack, Select, Td, Text, Tr } from '@chakra-ui/react';
import { ManagerWithPermissions } from 'app/api/manager/types';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { DeleteButton } from 'common/components/buttons/DeleteButton';
import { EditButton } from 'common/components/buttons/EditButton';
import { adminRolePTOptions } from 'pages/backoffice/utils';
import React from 'react';
import { t } from 'utils/i18n';

interface ManagersTableItemProps {
  manager: ManagerWithPermissions;
  updateMember(managerEmail: string, role: AdminRole): void;
  updateSuccess: boolean;
  deleteMember(managerEmail: string): void;
  isLoading: boolean;
}

export const ManagersTableItem = ({
  manager,
  updateMember,
  updateSuccess,
  deleteMember,
  isLoading,
}: ManagersTableItemProps) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  // state
  const [currentRole, setCurrentRole] = React.useState<AdminRole>();
  const [role, setRole] = React.useState<AdminRole>();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  // handlers
  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setRole(currentRole);
  };
  // side effects
  React.useEffect(() => {
    if (!manager.permissions) return;
    setCurrentRole(manager.permissions);
    setRole(manager.permissions);
  }, [manager.permissions]);
  React.useEffect(() => {
    if (!updateSuccess) return;
    setIsUpdating(false);
  }, [updateSuccess]);
  // UI
  if (isDeleting) {
    return (
      <Tr color="black" fontSize="sm" h="66px" bg="rgba(254, 215, 215, 0.3)" pos="relative">
        <Td>{manager.email}</Td>
        <Td position="relative">
          <Box position="absolute" top="2">
            <Text>{t('Confirmar exclusão?')}</Text>
            <HStack mt="1" spacing={4}>
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
      <Tr color="black" fontSize="sm" h="66px" pos="relative" bg="green.50">
        <Td>{manager.email}</Td>
        <Td textAlign="center">
          <Select
            w="140px"
            bgColor="white"
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
          >
            <option value="owner">{t('Proprietário')}</option>
            <option value="manager">{t('Gerente')}</option>
            <option value="collaborator">{t('Colaborador')}</option>
          </Select>
        </Td>
        <Td position="relative">
          <Box position="absolute" top="1">
            <Text>{t('Confirmar atualização?')}</Text>
            <HStack mt="1" spacing={4}>
              <Button w="150px" size="sm" variant="danger" onClick={handleCancelUpdate}>
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
      <Td>{adminRolePTOptions[manager.permissions as AdminRole]}</Td>
      <Td>v8.3.4</Td>
      {userAbility?.can('update', 'businesses') ? (
        <Td>
          <EditButton onClick={() => setIsUpdating(true)} />
          <DeleteButton onClick={() => setIsDeleting(true)} />
        </Td>
      ) : (
        <Td></Td>
      )}
    </Tr>
  );
};
