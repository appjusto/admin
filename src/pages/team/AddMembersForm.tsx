import { Box, Button, HStack, Switch, Text, Tooltip } from '@chakra-ui/react';
import { CloseButton } from 'common/components/buttons/CloseButton';
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

  const handleSubmit = () => {
    console.log(members);
  };

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
          <HStack mt="4" spacing={4} alignItems="center">
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
          <Button type="submit" mt="8" fontSize="sm" fontWeight="500">
            {t('Salvar alterações')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
