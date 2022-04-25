import { Box, Button, RadioGroup, Stack, Text, Tooltip } from '@chakra-ui/react';
import { useManagers } from 'app/api/manager/useManagers';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CloseButton } from 'common/components/buttons/CloseButton';
import CustomRadio from 'common/components/form/CustomRadio';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { intersection } from 'lodash';
import React from 'react';
import { t } from 'utils/i18n';
import { getBusinessManagerPermissionsObject, ManagerBasicRole } from './utils';

type Member = {
  email: string;
  role: ManagerBasicRole;
};

const memberObj = {
  email: '',
  role: 'collaborator',
} as Member;

export const AddMembersForm = () => {
  //context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business } = useContextBusiness();
  const { createManager, createResult } = useManagers();
  const { isLoading, isSuccess } = createResult;
  // state
  const [members, setMembers] = React.useState<Member[]>([memberObj]);
  // handlers
  const AddMemberFields = () => {
    setMembers((prevState) => [...prevState, memberObj]);
  };
  const removeMemberFields = (stateIndex: number) => {
    setMembers((prevState) => {
      return prevState.filter((member, index) => index !== stateIndex);
    });
  };
  const updateMember = (stateIndex: number, field: string, value: string | boolean) => {
    setMembers((prevState) => {
      const newState = prevState.map((member, index) => {
        if (index === stateIndex) {
          return { ...member, [field]: value };
        } else {
          return member;
        }
      });
      return newState;
    });
  };
  const handleSubmit = async () => {
    if (!business?.id)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AddMembersForm-valid-no-business',
      });
    const managers = members.map((member) => {
      const permissions = getBusinessManagerPermissionsObject(member.role);
      return {
        email: member.email,
        permissions,
      };
    });
    if (managers.find((manager) => !manager.email)) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AddMembersForm-valid-no-email',
        message: {
          title: 'Ocorreu um erro com um ou mais dos emails informados.',
          description: 'Verifica as informações preenchidas e tenta novamente?',
        },
      });
    }
    const membersEmails = members.map((member) => member.email);
    const isIntersection = intersection(business.managers, membersEmails).length > 0;
    if (isIntersection) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AddMembersForm-valid-email-in-use',
        message: {
          title: 'Um ou mais usuários já existem.',
          description: 'Alguns e-mails informados já foram cadastrados para outros usuários.',
        },
      });
    }
    await createManager(managers);
  };
  // side effects
  React.useEffect(() => {
    if (isSuccess) setMembers([memberObj]);
  }, [isSuccess]);
  // UI
  return (
    <Box mt="8" w="100%">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}
      >
        <Text fontSize="lg" color="black">
          {t('Adicionar novos colaboradores')}
        </Text>
        <Box overflowX="auto">
          {members.map((member, index) => (
            <Stack
              key={members.length + index}
              mt="4"
              w="100%"
              direction={{ base: 'column', md: 'row' }}
              spacing={4}
              alignItems={{ base: 'flex-start', md: 'center' }}
              pos="relative"
            >
              <CustomInput
                mt="0"
                maxW="300px"
                id={`member-email-${index}`}
                label={t('E-mail do colaborador')}
                placeholder={t('Digite o e-mail do colaborador')}
                value={member.email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  updateMember(index, 'email', event.target.value)
                }
              />
              <Text color="black" fontSize="sm" fontWeight="700">
                {t('Papel do usuário:')}
              </Text>
              <RadioGroup
                onChange={(value: ManagerBasicRole) => updateMember(index, 'role', value)}
                value={member.role}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  alignItems="flex-start"
                  color="black"
                  spacing={8}
                  fontSize="16px"
                  lineHeight="22px"
                >
                  <CustomRadio value="owner">{t('Proprietário')}</CustomRadio>
                  <CustomRadio value="manager">{t('Gerente')}</CustomRadio>
                  <CustomRadio value="collaborator">{t('Colaborador')}</CustomRadio>
                </Stack>
              </RadioGroup>
              <Box w="40px">
                {index > 0 && (
                  <Tooltip placement="top" label={t('Remover')} aria-label={t('Remover')}>
                    <CloseButton
                      size="sm"
                      variant="dangerLight"
                      onClick={() => removeMemberFields(index)}
                    />
                  </Tooltip>
                )}
              </Box>
            </Stack>
          ))}
        </Box>
        <Button mt="4" size="sm" variant="outline" onClick={AddMemberFields}>
          {t('Adicionar mais')}
        </Button>
        <Box>
          <Button type="submit" mt="8" fontSize="sm" fontWeight="500" isLoading={isLoading}>
            {t('Salvar alterações')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
