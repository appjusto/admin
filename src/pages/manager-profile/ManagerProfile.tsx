import { Box } from '@chakra-ui/react';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextManagerProfile } from 'app/state/manager/context';
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
  const profile = useContextManagerProfile();
  const { updateProfile, updateResult } = useUpdateManagerProfile();
  const { isLoading, isSuccess } = updateResult;

  // state
  const [name, setName] = React.useState(profile?.name ?? '');
  const [surname, setSurname] = React.useState(profile?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(profile?.phone ?? '');
  const [cpf, setCPF] = React.useState(profile?.cpf ?? '');

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);

  // side effects
  React.useEffect(() => {
    nameRef?.current?.focus();
  }, []);
  React.useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.surname) setSurname(profile.surname);
      if (profile.phone) setPhoneNumber(profile.phone);
      if (profile.cpf) setCPF(profile.cpf);
    }
  }, [profile]);

  // handlers
  const onSubmitHandler = async () => {
    await updateProfile({
      name,
      surname,
      phone: phoneNumber,
      cpf,
    });
  };

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
          id="manager-cpf"
          label={t('CPF')}
          placeholder={t('Número do seu CPF')}
          mask={cpfMask}
          parser={numbersOnlyParser}
          formatter={cpfFormatter}
          value={cpf}
          onValueChange={(value) => setCPF(value)}
          validationLength={11}
        />
        <PageFooter
          onboarding={onboarding}
          redirect={redirect}
          isLoading={isLoading}
          onSubmit={onSubmitHandler}
        />
      </form>
    </Box>
  );
};
