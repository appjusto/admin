import { Box } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextManagerProfile } from 'app/state/manager/context';
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
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

export const ManagerProfile = ({ onboarding, redirect, backoffice }: OnboardingProps) => {
  // context
  const user = useContextFirebaseUser();
  const { manager } = useContextManagerProfile();
  const { updateProfile, updateResult } = useUpdateManagerProfile();
  const { isLoading, isSuccess, isError } = updateResult;

  // state
  const [name, setName] = React.useState(manager?.name ?? '');
  const [surname, setSurname] = React.useState(manager?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(manager?.phone ?? '');
  const [cpf, setCPF] = React.useState(manager?.cpf ?? '');

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);

  // helpers
  const isCPFValid = () => cpfutils.isValid(cpf);

  // handlers
  const clearState = React.useCallback(() => {
    setName('');
    setSurname('');
    setPhoneNumber('');
    setCPF('');
  }, []);

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

  // side effects
  React.useEffect(() => {
    if (onboarding) window?.scrollTo(0, 0);
    if (!backoffice) nameRef?.current?.focus();
  }, [onboarding, backoffice]);

  React.useEffect(() => {
    clearState();
    if (manager) {
      setName(manager.name ?? '');
      setSurname(manager.surname ?? '');
      setPhoneNumber(manager.phone ?? '');
      setCPF(manager.cpf ?? '');
    }
  }, [manager, clearState]);

  console.dir({
    name,
    surname,
    phoneNumber,
    cpf,
  });

  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box maxW={backoffice ? '464px' : '368px'}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        {!backoffice && (
          <PageHeader
            title={t('Informe seus dados')}
            subtitle={t('Informações do administrador da conta')}
          />
        )}
        <CustomInput
          id="manager-profile-email"
          label={t('E-mail')}
          value={!backoffice ? user?.email ?? '' : manager?.email ?? ''}
          isDisabled={!backoffice}
        />
        <CustomInput
          isRequired
          id="manager-profile-name"
          ref={nameRef}
          label={t('Nome')}
          placeholder={t('Nome')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <CustomInput
          isRequired
          id="manager-profile-lastname"
          label={t('Sobrenome')}
          placeholder={t('Sobrenome')}
          value={surname}
          onChange={(ev) => setSurname(ev.target.value)}
        />
        <CustomPatternInput
          isRequired
          ref={phoneNumberRef}
          id="manager-phone"
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
          id="manager-cpf"
          label={t('CPF')}
          placeholder={t('Número do seu CPF')}
          mask={cpfMask}
          parser={numbersOnlyParser}
          formatter={cpfFormatter}
          value={cpf}
          onValueChange={(value) => setCPF(value)}
          externalValidation={{ active: true, status: isCPFValid() }}
        />
        <PageFooter onboarding={onboarding} redirect={redirect} isLoading={isLoading} />
        {!onboarding && isSuccess && (
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
