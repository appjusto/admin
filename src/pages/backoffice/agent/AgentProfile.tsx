import { Box } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useUpdateAgentProfile } from 'app/api/agent/useUpdateAgentProfile';
import { useContextAgentProfile } from 'app/state/agent/context';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';

export const AgentProfile = () => {
  // context
  const { agent } = useContextAgentProfile();
  const { updateProfile, updateResult } = useUpdateAgentProfile();
  const { isLoading, isSuccess, isError } = updateResult;

  // state
  const [name, setName] = React.useState(agent?.name ?? '');
  const [surname, setSurname] = React.useState(agent?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(agent?.phone ?? '');
  const [cpf, setCPF] = React.useState(agent?.cpf ?? '');

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);

  // helpers
  const isCPFValid = () => cpfutils.isValid(cpf);

  // side effects

  React.useEffect(() => {
    if (agent) {
      if (agent.name) setName(agent.name);
      if (agent.surname) setSurname(agent.surname);
      if (agent.phone) setPhoneNumber(agent.phone);
      if (agent.cpf) setCPF(agent.cpf);
    }
  }, [agent]);

  // handlers
  const onSubmitHandler = async () => {
    if (!isCPFValid()) return cpfRef?.current?.focus();
    if (phoneNumber.length < 11) return phoneNumberRef?.current?.focus();
    await updateProfile({
      name,
      surname,
      phone: phoneNumber,
      cpf,
    });
  };

  // UI
  return (
    <Box maxW="368px">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        <PageHeader
          title={t('Informe seus dados')}
          subtitle={t('Informações do agente appjusto')}
        />
        <CustomInput
          id="agent-profile-email"
          label={t('E-mail')}
          value={agent?.email ?? ''}
          isDisabled
        />
        <CustomInput
          isRequired
          id="agent-profile-name"
          ref={nameRef}
          label={t('Nome')}
          placeholder={t('Nome')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <CustomInput
          isRequired
          id="agent-profile-lastname"
          label={t('Sobrenome')}
          placeholder={t('Sobrenome')}
          value={surname}
          onChange={(ev) => setSurname(ev.target.value)}
        />
        <CustomPatternInput
          isRequired
          ref={phoneNumberRef}
          id="agent-phone"
          label={t('Celular')}
          placeholder={t('Número do seu celular')}
          mask={phoneMask}
          parser={numbersOnlyParser}
          formatter={phoneFormatter}
          value={phoneNumber}
          onValueChange={(value) => setPhoneNumber(value)}
          validationLength={11}
        />
        <CustomPatternInput
          isRequired
          ref={cpfRef}
          id="agent-cpf"
          label={t('CPF')}
          placeholder={t('Número do seu CPF')}
          mask={cpfMask}
          parser={numbersOnlyParser}
          formatter={cpfFormatter}
          value={cpf}
          onValueChange={(value) => setCPF(value)}
          externalValidation={{ active: true, status: isCPFValid() }}
        />
        <PageFooter isLoading={isLoading} />
        {isSuccess && (
          <AlertSuccess
            maxW="320px"
            title={t('Informações salvas com sucesso!')}
            description={''}
          />
        )}
        {isError && (
          <AlertError
            w="100%"
            title={t('Erro')}
            description={'Não foi possível acessar o servidor. Tenta novamente?'}
          />
        )}
      </form>
    </Box>
  );
};
