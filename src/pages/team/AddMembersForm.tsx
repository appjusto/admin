import { AdminRole } from '@appjusto/types';
import { Box, Button, RadioGroup, Stack, Text, Tooltip } from '@chakra-ui/react';
import { useManagers } from 'app/api/manager/useManagers';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CloseButton } from 'common/components/buttons/CloseButton';
import CustomRadio from 'common/components/form/CustomRadio';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { Select } from 'common/components/form/select/Select';
import { intersection } from 'lodash';
import React from 'react';
import { t } from 'utils/i18n';

type Member = {
  email: string;
  role: AdminRole;
};

const memberObj = {
  email: '',
  role: 'collaborator',
} as Member;

const ownerLabel = t(
  'Como proprietário, o usuário terá total acesso à plataforma do restaurante. Sendo prerrogativa apenas sua, clonar ou excluir o restaurante e criar e alterar colaboradores com papel de proprietário ou gerente'
);
const managerLabel = t(
  'Como gerente, o usuário pode alterar dados do restaurante, adicionar, alterar ou excluir colaboradores com papel de "colaborador", realizar operações financeiras (como saques e antecipações), adicionar, alterar e excluir items do cardápio, gerenciar o fluxo dos pedidos e enviar e receber mensagens de chat'
);
const collaboratorLabel = t(
  'Como colaborador, o usuário pode realizar alterações em itens existentes do cardápio, gerenciar o fluxo dos pedidos e enviar e receber mensagens de chat'
);

interface AddMembersFormProps {
  isBackoffice?: boolean;
}

export const AddMembersForm = ({ isBackoffice }: AddMembersFormProps) => {
  //context
  const { userAbility } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business } = useContextBusiness();
  const { createManager, createManagerResult } = useManagers();
  const { isLoading, isSuccess } = createManagerResult;
  // state
  const [members, setMembers] = React.useState<Member[]>([memberObj]);
  // helpers
  const userIsOwner = userAbility?.can('delete', 'businesses');
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
    if (members.find((member) => !member.email)) {
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
    const newManagers = members.map((member) => ({
      email: member.email,
      permissions: member.role,
    }));
    await createManager(newManagers);
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
              {isBackoffice ? (
                <Select
                  w="160px"
                  label={t('Papel do usuário:')}
                  value={member.role}
                  onChange={(e) => updateMember(index, 'role', e.target.value as AdminRole)}
                >
                  <option value="owner">{t('Proprietário')}</option>
                  <option value="manager">{t('Gerente')}</option>
                  <option value="collaborator">{t('Colaborador')}</option>
                </Select>
              ) : (
                <>
                  <Text color="black" fontSize="sm" fontWeight="700">
                    {t('Papel do usuário:')}
                  </Text>
                  <RadioGroup
                    onChange={(value: AdminRole) => updateMember(index, 'role', value)}
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
                      <Tooltip hasArrow label={ownerLabel} placement="top">
                        <Box display={userIsOwner ? 'block' : 'none'}>
                          <CustomRadio value="owner">{t('Proprietário')}</CustomRadio>
                        </Box>
                      </Tooltip>
                      <Tooltip hasArrow label={managerLabel} placement="top">
                        <Box display={userIsOwner ? 'block' : 'none'}>
                          <CustomRadio value="manager">{t('Gerente')}</CustomRadio>
                        </Box>
                      </Tooltip>
                      <Tooltip hasArrow label={collaboratorLabel} placement="top">
                        <Box>
                          <CustomRadio value="collaborator">{t('Colaborador')}</CustomRadio>
                        </Box>
                      </Tooltip>
                    </Stack>
                  </RadioGroup>
                </>
              )}
              <Box w="40px">
                {members.length > 1 && (
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
        <Button
          mt="4"
          size="sm"
          variant={isBackoffice ? 'secondary' : 'outline'}
          onClick={AddMemberFields}
        >
          {t('Adicionar mais')}
        </Button>
        <Box>
          <Button
            type="submit"
            mt={isBackoffice ? '4' : '8'}
            fontSize="sm"
            fontWeight="500"
            isLoading={isLoading}
          >
            {isBackoffice ? t('Salvar colaboradores') : t('Salvar alterações')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
