import { Box, Button, HStack, RadioGroup, Td, Text, Tr } from '@chakra-ui/react';
import { ManagerWithPermissions } from 'app/api/manager/types';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import { formatDate, formatTime } from 'utils/formatters';
import { t } from 'utils/i18n';
import { getBusinessManagerBasicRole, ManagerBasicRole } from './utils';

interface TeamTableItemProps {
  manager: ManagerWithPermissions;
  updateMember(managerEmail: string, role: ManagerBasicRole): void;
  updateSuccess: boolean;
  deleteMember(managerEmail: string): void;
  isLoading: boolean;
}

export const TeamTableItem = ({
  manager,
  updateMember,
  updateSuccess,
  deleteMember,
  isLoading,
}: TeamTableItemProps) => {
  // state
  const [currentRole, setCurrentRole] = React.useState<ManagerBasicRole>();
  const [role, setRole] = React.useState<ManagerBasicRole>();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState<boolean>();
  // side effects
  React.useEffect(() => {
    if (!manager.permissions) return;
    const basicRole = getBusinessManagerBasicRole(manager.permissions);
    setCurrentRole(basicRole);
    setRole(basicRole);
  }, [manager.permissions, getBusinessManagerBasicRole]);
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
