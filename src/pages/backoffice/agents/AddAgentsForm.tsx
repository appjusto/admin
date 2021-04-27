import { Box, Button, HStack, Radio, RadioGroup, Text, Tooltip } from '@chakra-ui/react';
import { CloseButton } from 'common/components/buttons/CloseButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';

type Agent = {
  email: string;
  role: string;
};

const agentObj = {
  email: '',
  role: 'viewer',
};

export const AddAgentsForm = () => {
  //context

  // state
  const [agents, setAgents] = React.useState<Agent[]>([agentObj]);

  // handlers
  const AddAgentFields = () => {
    setAgents((prevState) => [...prevState, agentObj]);
  };

  const removeAgentFields = (stateIndex: number) => {
    setAgents((prevState) => {
      return prevState.filter((member, index) => index !== stateIndex);
    });
  };

  const updateAgent = (stateIndex: number, field: string, value: string) => {
    setAgents((prevState) => {
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
    console.log(agents);
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
        {agents.map((agent, index) => (
          <HStack key={Math.random()} mt="4" spacing={4} alignItems="center">
            <CustomInput
              mt="0"
              w="300px"
              id={`agent-email-${index}`}
              label={t('E-mail do colaborador')}
              placeholder={t('Digite o e-mail do colaborador')}
              value={agent.email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                updateAgent(index, 'email', event.target.value)
              }
            />
            <RadioGroup
              mt="4"
              onChange={(value) => updateAgent(index, 'role', value as string)}
              value={agent.role}
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
                <Text w="120px" mr="-4">
                  {t('Papel do agente:')}
                </Text>
                <Radio value="owner">{t('Owner')}</Radio>
                <Radio value="staff">{t('Staff')}</Radio>
                <Radio value="viewer">{t('Viewer')}</Radio>
              </HStack>
            </RadioGroup>
            <Box w="40px">
              {index > 0 && (
                <Tooltip placement="top" label={t('Remover')} aria-label={t('Remover')}>
                  <CloseButton
                    size="sm"
                    variant="dangerLight"
                    onClick={() => removeAgentFields(index)}
                  />
                </Tooltip>
              )}
            </Box>
          </HStack>
        ))}
        <Button mt="4" size="sm" variant="outline" onClick={AddAgentFields}>
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
