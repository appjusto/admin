import { Box, Button, HStack, Switch, Text, Tooltip } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useCreateManager } from 'app/api/manager/useCreateManager';
import { useContextBusiness } from 'app/state/business/context';
import { AdminRole } from 'appjusto-types';
import { CloseButton } from 'common/components/buttons/CloseButton';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomInput } from 'common/components/form/input/CustomInput';
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
  const { business } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  const { createManager, result } = useCreateManager();
  const { isLoading, isSuccess, isError, error: createError } = result;

  // state
  const [members, setMembers] = React.useState<Member[]>([memberObj]);
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);

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

  const handleSubmit = () => {
    console.log('Submit!');
    console.log(business?.id);
    console.log(members);
    if (!business?.id)
      return setError({
        status: true,
        error: null,
      });
    members.forEach(async (member) => {
      console.log('forEach?', member);
      if (!member.email)
        return setError({
          status: true,
          error: null,
          message: {
            title: 'Ocorreu um erro com um ou mais dos emails informados.',
            description: 'Tenta novamente?',
          },
        });
      console.log('do creation');
      const role: AdminRole = member.isManager ? 'manager' : 'collaborator';
      const created = await createManager({ email: member.email, key: business.id!, role });
      console.log('created?', created);
      if (created) {
        let managers = business.managers;
        console.log('managers', business.managers);
        if (managers && !managers.includes(member.email)) {
          managers.push(member.email);
          updateBusinessProfile({ managers });
        }
      }
      submission.current += 1;
    });
    setMembers([memberObj]);
  };

  // side effects
  React.useEffect(() => {
    if (isError)
      setError({
        status: true,
        error: createError,
      });
  }, [isError, createError]);

  // UI
  return (
    <Box mt="8" maxW="700px">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}
      >
        <Text fontSize="lg" color="black">
          {t('Adicionar novos colaboradores')}
        </Text>
        {members.map((member, index) => (
          <HStack key={members.length + index} mt="4" spacing={4} alignItems="center">
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
        <Button mt="4" size="sm" variant="outline" onClick={AddMemberFields}>
          {t('Adicionar mais')}
        </Button>
        <Box>
          <Button type="submit" mt="8" fontSize="sm" fontWeight="500" isLoading={isLoading}>
            {t('Salvar alterações')}
          </Button>
        </Box>
      </form>
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={isError}
        error={error.error}
        errorMessage={error.message}
      />
    </Box>
  );
};
