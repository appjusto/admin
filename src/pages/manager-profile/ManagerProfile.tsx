import { Box, Flex } from '@chakra-ui/react';
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
  const [ddd, setDDD] = React.useState(profile?.phone?.ddd ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(profile?.phone?.number ?? '');
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
      if (profile.phone?.ddd) setDDD(profile.phone.ddd);
      if (profile.phone?.number) setPhoneNumber(profile.phone.number);
      if (profile.cpf) setCPF(profile.cpf);
    }
  }, [profile]);

  // handlers
  const onSubmitHandler = async () => {
    await updateProfile({
      name,
      surname,
      phone: {
        ddd,
        number: phoneNumber,
      },
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
          id="manager-profile-name"
          ref={nameRef}
          label={t('Nome')}
          placeholder={t('Nome')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <CustomInput
          id="manager-profile-lastname"
          label={t('Sobrenome')}
          placeholder={t('Sobrenome')}
          value={surname}
          onChange={(ev) => setSurname(ev.target.value)}
        />
        <Flex flexDir="row">
          <CustomPatternInput
            flex={1}
            mr="4"
            id="manager-ddd"
            label={t('DDD')}
            placeholder={t('00')}
            maxLength={2}
            parser={numbersOnlyParser}
            value={ddd}
            onValueChange={(value: string) => setDDD(value)}
          />
          <CustomPatternInput
            flex={4}
            id="manager-phone"
            label={t('Celular')}
            placeholder={t('Número do seu celular')}
            mask={phoneMask}
            parser={numbersOnlyParser}
            formatter={phoneFormatter}
            value={phoneNumber}
            onValueChange={(value) => setPhoneNumber(value)}
          />
        </Flex>
        <CustomPatternInput
          id="manager-cpf"
          label={t('CPF')}
          placeholder={t('Número do seu CPF')}
          mask={cpfMask}
          parser={numbersOnlyParser}
          formatter={cpfFormatter}
          value={cpf}
          onValueChange={(value) => setCPF(value)}
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
