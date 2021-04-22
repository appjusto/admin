import { Box, Button } from '@chakra-ui/react';
import * as cnpjutils from '@fnando/cnpj';
import * as cpfutils from '@fnando/cpf';
import { CourierProfile, WithId } from 'appjusto-types';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  cnpjFormatter,
  cnpjMask,
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
  isCNPJ?: boolean;
}

export const PersonalProfile = ({
  profile,
  updateProfile,
  result,
  isCNPJ,
}: PersonalProfileProps) => {
  // context
  const { isLoading, isSuccess, isError } = result;

  // state
  const [name, setName] = React.useState(profile?.name ?? '');
  const [surname, setSurname] = React.useState(profile?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(profile?.phone ?? '');
  const [cpf, setCPF] = React.useState(profile?.cpf ?? '');
  const [cnpj, setCNPJ] = React.useState(profile?.company?.cnpj ?? '');

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const cnpjRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);

  // helpers
  const isCPFValid = () => cpfutils.isValid(cpf);
  const isCPNJValid = () => cnpjutils.isValid(cnpj);

  // handlers
  const onSubmitHandler = async () => {
    if (!isCPFValid()) return cpfRef?.current?.focus();
    if (!isCPNJValid()) return cnpjRef?.current?.focus();
    if (phoneNumber.length < 11) return phoneNumberRef?.current?.focus();
    let company = profile?.company ?? undefined;
    if (company && cnpj) company.cnpj = cnpj;
    await updateProfile({
      name,
      surname,
      phone: phoneNumber,
      cpf,
      company,
    });
  };

  // side effects
  React.useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.surname) setSurname(profile.surname);
      if (profile.phone) setPhoneNumber(profile.phone);
      if (profile.cpf) setCPF(profile.cpf);
      if (isCNPJ && profile.company?.cnpj) setCNPJ(profile.company.cnpj);
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
          id="user-profile-email"
          label={t('E-mail')}
          value={profile?.email ?? ''}
          isDisabled
        />
        <CustomInput
          isRequired
          id="user-profile-name"
          ref={nameRef}
          label={t('Nome')}
          placeholder={t('Nome')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <CustomInput
          isRequired
          id="user-profile-lastname"
          label={t('Sobrenome')}
          placeholder={t('Sobrenome')}
          value={surname}
          onChange={(ev) => setSurname(ev.target.value)}
        />
        <CustomPatternInput
          isRequired
          ref={phoneNumberRef}
          id="user-phone"
          label={t('Celular')}
          placeholder={t('Número do celular')}
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
          id="user-cpf"
          label={t('CPF')}
          placeholder={t('Número do CPF')}
          mask={cpfMask}
          parser={numbersOnlyParser}
          formatter={cpfFormatter}
          value={cpf}
          onValueChange={(value) => setCPF(value)}
          externalValidation={{ active: true, status: isCPFValid() }}
        />
        {isCNPJ && (
          <CustomPatternInput
            isRequired
            ref={cnpjRef}
            id="user-cnpj"
            label={t('CNPJ')}
            placeholder={t('Número do CNPJ')}
            mask={cnpjMask}
            parser={numbersOnlyParser}
            formatter={cnpjFormatter}
            value={cnpj}
            onValueChange={(value) => setCNPJ(value)}
            externalValidation={{ active: true, status: isCPNJValid() }}
          />
        )}
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
