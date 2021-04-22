import { Box, Button } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { CourierProfile, WithId } from 'appjusto-types';
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
import React from 'react';
import { t } from 'utils/i18n';
import { Result, UpdateProfile } from '../generics/types';

interface PersonalProfileProps {
  profile: WithId<CourierProfile> | null | undefined;
  updateProfile: UpdateProfile;
  result: Result;
}

export const PersonalProfile = ({ profile, updateProfile, result }: PersonalProfileProps) => {
  // context
  const { isLoading, isSuccess, isError } = result;

  // state
  const [name, setName] = React.useState(profile?.name ?? '');
  const [surname, setSurname] = React.useState(profile?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(profile?.phone ?? '');
  const [cpf, setCPF] = React.useState(profile?.cpf ?? '');

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);

  // helpers
  const isCPFValid = () => cpfutils.isValid(cpf);

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

  // side effects
  React.useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.surname) setSurname(profile.surname);
      if (profile.phone) setPhoneNumber(profile.phone);
      if (profile.cpf) setCPF(profile.cpf);
    }
  }, [profile]);

  // UI
  return (
    <Box>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        <CustomInput
          id="manager-profile-email"
          label={t('E-mail')}
          value={profile?.email ?? ''}
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
        <Button
          mt="8"
          minW="200px"
          type="submit"
          size="lg"
          fontSize="sm"
          fontWeight="500"
          fontFamily="Barlow"
          isLoading={isLoading}
          loadingText={t('Salvando')}
        >
          {t('Salvar')}
        </Button>
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
