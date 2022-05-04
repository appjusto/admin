import { Box, Text } from '@chakra-ui/react';
import * as cnpjutils from '@fnando/cnpj';
import * as cpfutils from '@fnando/cpf';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextCourierProfile } from 'app/state/courier/context';
import { WhatsappButton } from 'common/components/buttons/WhatsappButton';
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
import { normalizeEmail } from 'utils/email';
import { t } from 'utils/i18n';

interface PersonalProfileProps {
  isCNPJ?: boolean;
}

export const PersonalProfile = ({ isCNPJ }: PersonalProfileProps) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { courier, handleProfileChange, isEditingEmail, setIsEditingEmail } =
    useContextCourierProfile();
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
  // UI
  return (
    <Box>
      {isEditingEmail ? (
        <Box>
          <Text
            textAlign="end"
            color="red"
            textDecor="underline"
            cursor="pointer"
            onClick={() => setIsEditingEmail(false)}
          >
            {t('Desativar edição')}
          </Text>
          <CustomInput
            mt="2"
            id="user-profile-email"
            label={t('E-mail')}
            value={courier?.email ?? ''}
            onChange={(ev) => handleInputChange('email', normalizeEmail(ev.target.value))}
          />
        </Box>
      ) : (
        <Box>
          <Text
            display={userAbility?.can('update', 'couriers') ? 'block' : 'none'}
            textAlign="end"
            color="green.600"
            textDecor="underline"
            cursor="pointer"
            onClick={() => setIsEditingEmail(true)}
          >
            {t('Editar email')}
          </Text>
          <CustomInput
            mt="2"
            id="user-profile-email"
            label={t('E-mail')}
            value={courier?.email ?? ''}
            isDisabled
          />
        </Box>
      )}
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
      <Box position="relative">
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
        {courier?.phone && (
          <WhatsappButton
            phone={courier.phone}
            label={t('Iniciar')}
            position="absolute"
            top="6px"
            right="4px"
            zIndex="9999"
          />
        )}
      </Box>
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
