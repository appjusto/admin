import { AdminRole } from '@appjusto/types';
import { Box, Button, HStack, Select, Td, Text, Tooltip, Tr } from '@chakra-ui/react';
import { ManagerWithRole } from 'app/api/manager/types';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { CancelButton } from 'common/components/buttons/CancelButton';
import { CheckButton } from 'common/components/buttons/CheckButton';
import { DeleteButton } from 'common/components/buttons/DeleteButton';
import { EditButton } from 'common/components/buttons/EditButton';
import { adminRolePTOptions } from 'pages/backoffice/utils';
import React from 'react';
import { t } from 'utils/i18n';
import { getAppVersionLabelColor } from 'utils/version';

interface ManagersTableItemProps {
  manager: ManagerWithRole;
  minVersion?: string | null;
  updateMember(managerEmail: string, role: AdminRole): void;
  updateSuccess: boolean;
  deleteMember(managerEmail: string): void;
  isLoading: boolean;
}

export const ManagersTableItem = ({
  manager,
  minVersion,
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
  //helpers
  const versionLabelColor = getAppVersionLabelColor(minVersion, manager.appVersion);
  // handlers
  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setRole(currentRole);
  };
  // side effects
  React.useEffect(() => {
    if (!manager.role) return;
    setCurrentRole(manager.role);
    setRole(manager.role);
  }, [manager.role]);
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
          <Box position="absolute" top="1" minW="154px">
            <Text>{t('Confirmar atualização?')}</Text>
            <HStack mt="1" spacing={2}>
              <Tooltip placement="top" label={t('Cancelar')} aria-label={t('cancelar-edicao')}>
                <CancelButton w="full" onClick={handleCancelUpdate} />
              </Tooltip>
              <Tooltip
                placement="top"
                label={t('Atualizar')}
                aria-label={t('atualizar-colaborador')}
              >
                <CheckButton
                  w="full"
                  onClick={() => updateMember(manager.email, role!)}
                  isLoading={isLoading}
                />
              </Tooltip>
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
      <Td>{adminRolePTOptions[manager.role as AdminRole]}</Td>
      <Td color={versionLabelColor}>{manager?.appVersion ?? 'N/E'}</Td>
      {userAbility?.can('update', 'businesses') ? (
        <Td>
          <Tooltip placement="top" label={t('Editar')} aria-label={t('editar-colaborador')}>
            <EditButton onClick={() => setIsUpdating(true)} />
          </Tooltip>
          <Tooltip placement="top" label={t('Remover')} aria-label={t('remover-colaborador')}>
            <DeleteButton onClick={() => setIsDeleting(true)} />
          </Tooltip>
        </Td>
      ) : (
        <Td></Td>
      )}
    </Tr>
  );
};
