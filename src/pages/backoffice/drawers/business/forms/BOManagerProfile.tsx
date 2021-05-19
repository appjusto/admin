import { Box } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';

export const BOManagerProfile = () => {
  // context
  const { manager, handleManagerProfileChange: handleChange } = useContextBusinessBackoffice();
  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const isCPFValid = () => (manager?.cpf ? cpfutils.isValid(manager.cpf) : true);
  // UI
  return (
    <Box maxW="464px">
      <PageHeader
        title={t('Informe seus dados')}
        subtitle={t('Informações do administrador da conta')}
      />
      <CustomInput
        id="manager-profile-email"
        label={t('E-mail')}
        value={manager?.email ?? ''}
        isDisabled
      />
      <CustomInput
        isRequired
        id="manager-profile-name"
        ref={nameRef}
        label={t('Nome')}
        placeholder={t('Nome')}
        value={manager?.name ?? ''}
        onChange={(ev) => handleChange('name', ev.target.value)}
      />
      <CustomInput
        isRequired
        id="manager-profile-lastname"
        label={t('Sobrenome')}
        placeholder={t('Sobrenome')}
        value={manager?.surname ?? ''}
        onChange={(ev) => handleChange('surname', ev.target.value)}
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
        value={manager?.phone ?? ''}
        onValueChange={(value) => handleChange('phone', value)}
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
        value={manager?.cpf ?? ''}
        onValueChange={(value) => handleChange('cpf', value)}
        externalValidation={{ active: true, status: isCPFValid() }}
      />
    </Box>
  );
};
