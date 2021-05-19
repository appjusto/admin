import { Box } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useUpdateAgentProfile } from 'app/api/agent/useUpdateAgentProfile';
import { useContextAgentProfile } from 'app/state/agent/context';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
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
  const { isLoading, isSuccess, isError, error: updateError } = updateResult;

  // state
  const [name, setName] = React.useState(agent?.name ?? '');
  const [surname, setSurname] = React.useState(agent?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(agent?.phone ?? '');
  const [cpf, setCPF] = React.useState(agent?.cpf ?? '');
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);

  // helpers
  const isCPFValid = () => cpfutils.isValid(cpf);

  // handlers
  const onSubmitHandler = async () => {
    submission.current += 1;
    setError(initialError);
    if (!isCPFValid()) {
      console.log('Submit');
      setError({
        status: true,
        error: null,
        message: { title: 'O CPF informado não é válido.' },
      });
      return cpfRef?.current?.focus();
    }
    if (phoneNumber.length < 11) {
      setError({
        status: true,
        error: null,
        message: { title: 'O celular informado não é válido.' },
      });
      return phoneNumberRef?.current?.focus();
    }
    await updateProfile({
      name,
      surname,
      phone: phoneNumber,
      cpf,
    });
  };

  // side effects
  React.useEffect(() => {
    if (agent) {
      if (agent.name) setName(agent.name);
      if (agent.surname) setSurname(agent.surname);
      if (agent.phone) setPhoneNumber(agent.phone);
      if (agent.cpf) setCPF(agent.cpf);
    }
  }, [agent]);

  React.useEffect(() => {
    if (isError)
      setError({
        status: true,
        error: updateError,
      });
  }, [isError, updateError]);

  // UI
  return (
    <Box maxW="368px">
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
        isLoading={isLoading}
      />
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
      </form>
    </Box>
  );
};
