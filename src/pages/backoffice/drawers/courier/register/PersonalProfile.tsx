import { Box } from '@chakra-ui/react';
import * as cnpjutils from '@fnando/cnpj';
import * as cpfutils from '@fnando/cpf';
import { useContextCourierProfile } from 'app/state/courier/context';
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

interface PersonalProfileProps {
  isCNPJ?: boolean;
}

export const PersonalProfile = ({ isCNPJ }: PersonalProfileProps) => {
  // context
  const { courier, handleProfileChange } = useContextCourierProfile();

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const cnpjRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);

  // helpers
  const isCPFValid = () => cpfutils.isValid(courier?.cpf!);
  const isCPNJValid = () => cnpjutils.isValid(courier?.company?.cnpj!);

  // handlers
  const handleInputChange = (field: string, value: string) => {
    if (field === 'cnpj') {
      const newCompany = {
        ...courier?.company,
        cnpj: value,
      };
      handleProfileChange('company', newCompany);
    } else handleProfileChange(field, value);
  };
  /*const onSubmitHandler = async () => {
    if (!isCPFValid()) return cpfRef?.current?.focus();
    if (!isCPNJValid()) return cnpjRef?.current?.focus();
    if (phone.length < 11) return phoneNumberRef?.current?.focus();
  };*/

  // UI
  return (
    <Box>
      <CustomInput
        id="user-profile-email"
        label={t('E-mail')}
        value={courier?.email ?? ''}
        isDisabled
      />
      <CustomInput
        isRequired
        id="user-profile-name"
        ref={nameRef}
        label={t('Nome')}
        placeholder={t('Nome')}
        value={courier?.name ?? ''}
        onChange={(ev) => handleInputChange('name', ev.target.value)}
      />
      <CustomInput
        isRequired
        id="user-profile-lastname"
        label={t('Sobrenome')}
        placeholder={t('Sobrenome')}
        value={courier?.surname ?? ''}
        onChange={(ev) => handleInputChange('surname', ev.target.value)}
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
        value={courier?.phone ?? ''}
        onValueChange={(value) => handleInputChange('phone', value)}
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
        value={courier?.cpf ?? ''}
        onValueChange={(value) => handleInputChange('cpf', value)}
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
          value={courier?.company?.cnpj ?? ''}
          onValueChange={(value) => handleInputChange('cnpj', value)}
          externalValidation={{ active: true, status: isCPNJValid() }}
        />
      )}
    </Box>
  );
};
