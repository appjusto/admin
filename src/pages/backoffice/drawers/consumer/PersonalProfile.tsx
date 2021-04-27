import { Box } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useContextConsumerProfile } from 'app/state/consumer/context';
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
import { SectionTitle } from '../generics/SectionTitle';

export const PersonalProfile = () => {
  // context
  const { consumer, handleProfileChange } = useContextConsumerProfile();

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);

  // helpers
  const isCPFValid = () => cpfutils.isValid(consumer?.cpf!);

  // handlers
  const handleInputChange = (field: string, value: string) => {
    return handleProfileChange(field, value);
  };

  // side effects

  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      <CustomInput
        id="user-profile-email"
        label={t('E-mail')}
        value={consumer?.email ?? ''}
        isDisabled
      />
      <CustomInput
        isRequired
        id="user-profile-name"
        ref={nameRef}
        label={t('Nome')}
        placeholder={t('Nome')}
        value={consumer?.name ?? ''}
        onChange={(ev) => handleInputChange('name', ev.target.value)}
      />
      <CustomInput
        isRequired
        id="user-profile-lastname"
        label={t('Sobrenome')}
        placeholder={t('Sobrenome')}
        value={consumer?.surname ?? ''}
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
        value={consumer?.phone ?? ''}
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
        value={consumer?.cpf ?? ''}
        onValueChange={(value) => handleInputChange('cpf', value)}
        externalValidation={{ active: true, status: isCPFValid() }}
      />
    </Box>
  );
};
