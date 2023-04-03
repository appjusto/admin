import { AdminRole, ManagerWithRole } from '@appjusto/types';
import { Box, Button, Flex, HStack, Td, Text, Tr } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { AppVersionLabel } from 'common/components/backoffice/AppVersionLabel';
import { Select } from 'common/components/form/select/Select';
import { adminRolePTOptions } from 'pages/backoffice/utils';
import React from 'react';
import { formatDate, formatTime } from 'utils/formatters';
import { t } from 'utils/i18n';
interface TeamTableItemProps {
  manager: ManagerWithRole;
  minVersion?: string | null;
  updateMember(managerEmail: string, role: AdminRole): void;
  updateSuccess: boolean;
  deleteMember(managerEmail: string): void;
  isLoading: boolean;
}

export const TeamTableItem = ({
  manager,
  minVersion,
  updateMember,
  updateSuccess,
  deleteMember,
  isLoading,
}: TeamTableItemProps) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  // state
  const [currentRole, setCurrentRole] = React.useState<AdminRole>();
  const [role, setRole] = React.useState<AdminRole>();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState<boolean>();
  // helpers
  const userIsOwner = userAbility?.can('delete', 'businesses');
  const userCanUpdate = userAbility?.can('update', { kind: 'managers', role });
  // side effects
  React.useEffect(() => {
    if (!manager.role) return;
    setCurrentRole(manager.role);
    setRole(manager.role);
  }, [manager.role]);
  React.useEffect(() => {
    if (!currentRole || !role) return;
    if (currentRole !== role) setIsUpdating(true);
  }, [currentRole, role]);
  React.useEffect(() => {
    if (isUpdating || !currentRole) return;
    if (isUpdating === false) setRole(currentRole);
  }, [updateSuccess, isUpdating, currentRole]);
  React.useEffect(() => {
    if (updateSuccess) {
      setIsUpdating(undefined);
      return;
    }
  }, [updateSuccess]);
  // UI
  if (isDeleting) {
    return (
      <Tr
        color="black"
        fontSize="sm"
        h="66px"
        bg="rgba(254, 215, 215, 0.3)"
        pos="relative"
      >
        <Td>{manager.email}</Td>
        <Td isNumeric>{t('Confirmar exclusão?')}</Td>
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
        <Td></Td>
      </Tr>
    );
  } else if (isUpdating) {
    return (
      <Tr color="black" fontSize="sm" h="66px" pos="relative" bg="green.50">
        <Td>{manager.email}</Td>
        <Td textAlign="center">
          <Select
            mt="0"
            w="150px"
            label={t('Papel do usuário:')}
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
          >
            <option value="owner">{t('Proprietário')}</option>
            <option value="manager">{t('Gerente')}</option>
            <option value="collaborator">{t('Colaborador')}</option>
          </Select>
        </Td>
        <Td position="relative">
          <Flex position="absolute" bottom="2" flexDir="column">
            <Text>{t('Confirmar atualização?')}</Text>
            <HStack mt="1" spacing={4}>
              <Button
                w="150px"
                size="sm"
                variant="danger"
                onClick={() => setIsUpdating(false)}
              >
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
          </Flex>
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
        {userIsOwner ? (
          <Select
            mt="0"
            w="150px"
            label={t('Papel do usuário:')}
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
          >
            <option value="owner">{t('Proprietário')}</option>
            <option value="manager">{t('Gerente')}</option>
            <option value="collaborator">{t('Colaborador')}</option>
          </Select>
        ) : role ? (
          adminRolePTOptions[role]
        ) : (
          'N/E'
        )}
      </Td>
      <Td>
        {formatDate(manager.createdOn as unknown as Date) +
          ' - ' +
          formatTime(manager.createdOn as unknown as Date)}
      </Td>
      <Td>
        (<AppVersionLabel type="businessWeb" version={manager?.webAppVersion} />
        )/(
        <AppVersionLabel type="businessApp" version={manager?.appVersion} />)
      </Td>
      <Td>
        <Button
          size="sm"
          minW="160px"
          variant="dangerLight"
          onClick={() => setIsDeleting(true)}
          isDisabled={!userCanUpdate}
        >
          {t('Excluir colaborador')}
        </Button>
      </Td>
    </Tr>
  );
};
