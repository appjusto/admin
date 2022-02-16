import { AdminRole } from '@appjusto/types';
import { Box, Button, HStack, Switch, Text, Tooltip } from '@chakra-ui/react';
import { useManagers } from 'app/api/manager/useManagers';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CloseButton } from 'common/components/buttons/CloseButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { intersection } from 'lodash';
import React from 'react';
import { t } from 'utils/i18n';

type Member = {
  email: string;
  isManager: boolean;
};

const memberObj = {
  email: '',
  isManager: false,
};

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
      const userRole: AdminRole = member.isManager ? 'manager' : 'collaborator';
      return {
        email: member.email,
        role: userRole,
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
    <Box mt="8" maxW={{ base: '100vw', lg: '700px' }}>
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
            <HStack
              key={members.length + index}
              mt="4"
              spacing={4}
              alignItems="center"
              pos="relative"
              minW="500px"
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
              <Text color="black" fontSize="sm">
                {t('Incluir como Administrador:')}
              </Text>
              <Switch
                isChecked={member.isManager}
                onChange={(ev) => {
                  ev.stopPropagation();
                  updateMember(index, 'isManager', ev.target.checked);
                }}
              />
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
            </HStack>
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
