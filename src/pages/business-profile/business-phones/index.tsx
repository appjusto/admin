import { BusinessPhone } from '@appjusto/types';
import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { BusinessPhoneItem } from './BusinessPhoneItem';

export type BusinessPhoneField = 'type' | 'number' | 'calls' | 'whatsapp';

interface BusinessPhonesProps {
  phones: BusinessPhone[];
  addPhone(): void;
  removePhone(index: number): void;
  handlePhoneUpdate(index: number, field: BusinessPhoneField, value: any): void;
  isBackoffice?: boolean;
}

export const BusinessPhones = ({
  phones,
  addPhone,
  removePhone,
  handlePhoneUpdate,
  isBackoffice = false,
}: BusinessPhonesProps) => {
  // UI
  return (
    <Box mt="8">
      <Text fontSize="xl" color="black">
        {t('Telefones de contato:')}
      </Text>
      {!isBackoffice && (
        <Text mt="2" fontSize="md">
          {t(
            'Para melhorar a experiência de atendimento com nosso suporte, é importante informar os telefones ativos para tratar sobre pedidos'
          )}
        </Text>
      )}
      {phones.map((phone, index) => (
        <BusinessPhoneItem
          key={index}
          index={index}
          phone={phone}
          isRemoving={phones.length > 1}
          handlePhoneUpdate={handlePhoneUpdate}
          removePhone={removePhone}
          isBackoffice
        />
      ))}
      <Button mt="4" variant="secondary" size="sm" onClick={addPhone}>
        {t('Adicionar telefone')}
      </Button>
    </Box>
  );
};
