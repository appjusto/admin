import { Box } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
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
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

export const ManagerProfile = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const user = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { manager } = useContextManagerProfile();
  const { updateProfile, updateResult } = useUpdateManagerProfile();
  const { isLoading, isSuccess, isError, error: updateError } = updateResult;

  // state
  const [name, setName] = React.useState(manager?.name ?? '');
  const [surname, setSurname] = React.useState(manager?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(manager?.phone ?? '');
  const [cpf, setCPF] = React.useState(manager?.cpf ?? '');
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);
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
    submission.current += 1;
    setError(initialError);
    if (!isCPFValid()) {
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
    if (onboarding) window?.scrollTo(0, 0);
    nameRef?.current?.focus();
  }, [onboarding]);

  React.useEffect(() => {
    clearState();
    if (manager) {
      setName(manager.name ?? '');
      setSurname(manager.surname ?? '');
      setPhoneNumber(manager.phone ?? '');
      setCPF(manager.cpf ?? '');
    }
  }, [manager, clearState]);

  React.useEffect(() => {
    if (isError)
      setError({
        status: true,
        error: updateError,
      });
  }, [isError, updateError]);

  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
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
          subtitle={t('Informações do administrador da conta')}
        />
        <CustomInput
          id="manager-profile-email"
          label={t('E-mail')}
          value={user?.email ?? ''}
          isDisabled
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
          isDisabled={business?.situation === 'approved'}
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
      </form>
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess && !onboarding}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </Box>
  );
};
