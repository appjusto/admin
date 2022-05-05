import { AdminRole } from '@appjusto/types';
import { Box, Button, HStack, RadioGroup, Td, Text, Tr } from '@chakra-ui/react';
import { ManagerWithRole } from 'app/api/manager/types';
import { useContextFirebaseUser } from 'app/state/auth/context';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import { formatDate, formatTime } from 'utils/formatters';
import { t } from 'utils/i18n';
import { getAppVersionLabelColor } from 'utils/version';
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
  const versionLabelColor = getAppVersionLabelColor(minVersion, manager.appVersion);
  // haldlers
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
      <Tr color="black" fontSize="sm" h="66px" bg="rgba(254, 215, 215, 0.3)" pos="relative">
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
      </Tr>
    );
  } else if (isUpdating) {
    return (
      <Tr color="black" fontSize="sm" h="66px" pos="relative" bg="green.50">
        <Td>{manager.email}</Td>
        <Td textAlign="center">
          <RadioGroup
            onChange={(value: AdminRole) => setRole(value)}
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
        <Td position="relative">
          <Box position="absolute" top="1">
            <Text>{t('Confirmar atualização?')}</Text>
            <HStack mt="1" spacing={4}>
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
          onChange={(value: AdminRole) => setRole(value)}
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
            spacing={4}
            fontSize="16px"
            lineHeight="22px"
          >
            <CustomRadio value="owner" isDisabled={!userIsOwner}>
              {t('Proprietário')}
            </CustomRadio>
            <CustomRadio value="manager" isDisabled={!userIsOwner}>
              {t('Gerente')}
            </CustomRadio>
            <CustomRadio value="collaborator" isDisabled={!userIsOwner}>
              {t('Colaborador')}
            </CustomRadio>
          </HStack>
        </RadioGroup>
      </Td>
      <Td>
        {formatDate(manager.createdOn as unknown as Date) +
          ' - ' +
          formatTime(manager.createdOn as unknown as Date)}
      </Td>
      <Td color={versionLabelColor}>{manager.appVersion ?? 'N/E'}</Td>
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
