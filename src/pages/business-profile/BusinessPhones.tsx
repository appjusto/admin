import { BusinessPhone } from '@appjusto/types';
import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomPatternInput as PatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { phoneFormatter, phoneMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { Select } from 'common/components/form/select/Select';
import React from 'react';
import { t } from 'utils/i18n';

interface BusinessPhonesProps {
  phones: BusinessPhone[];
  addPhone(): void;
  removePhone(index: number): void;
  handlePhoneUpdate(
    index: number,
    field: 'type' | 'number' | 'calls' | 'whatsapp',
    value: any
  ): void;
}

export const BusinessPhones = ({
  phones,
  addPhone,
  removePhone,
  handlePhoneUpdate,
}: BusinessPhonesProps) => {
  // UI
  return (
    <Box mt="8">
      <Text fontSize="xl" color="black">
        {t('Telefones de contato:')}
      </Text>
      <Text mt="2" fontSize="md">
        {t(
          'Para melhorar a experiência de atendimento com nosso suporte, é importante informar os telefones ativos para tratar sobre pedidos'
        )}
      </Text>
      {phones.map((item, index) => (
        <Stack
          key={index}
          mt={{ base: '8', md: '4' }}
          spacing={{ base: 3, md: 4 }}
          direction={{ base: 'column', md: 'row' }}
        >
          <HStack>
            <Select
              mt="0"
              w={{ base: '110px' }}
              minW={{ base: '110px' }}
              label={t('Tipo')}
              value={item.type}
              onChange={(e) => handlePhoneUpdate(index, 'type', e.target.value)}
            >
              <option value="owner">{t('Dono')}</option>
              <option value="manager">{t('Gerente')}</option>
              <option value="desk">{t('Balcão')}</option>
            </Select>
            <PatternInput
              w={{ base: '100%' }}
              minW={{ md: '220px' }}
              isRequired
              //ref={phoneRef}
              id={`business-phone-${index}`}
              label={t(`Número do telefone ${index === 0 ? '*' : ''}`)}
              placeholder={t('Nº de telefone ou celular')}
              mask={phoneMask}
              parser={numbersOnlyParser}
              formatter={phoneFormatter}
              value={item.number}
              onValueChange={(value) => handlePhoneUpdate(index, 'number', value)}
              validationLength={10}
            />
          </HStack>
          <HStack
            w={{ base: '100%' }}
            spacing={{ base: 6, md: 4 }}
            alignItems="center"
            fontSize="16px"
            lineHeight="22px"
          >
            <CustomCheckbox
              colorScheme="green"
              value="calls"
              isChecked={item.calls}
              onChange={(e) => handlePhoneUpdate(index, 'calls', e.target.checked)}
            >
              {t('Chamadas')}
            </CustomCheckbox>
            <CustomCheckbox
              colorScheme="green"
              value="whatsapp"
              isChecked={item.whatsapp}
              onChange={(e) => handlePhoneUpdate(index, 'whatsapp', e.target.checked)}
            >
              {t('Whatsapp')}
            </CustomCheckbox>
            {phones.length > 1 && (
              <Button size="sm" variant="ghost" fontSize="13px" onClick={() => removePhone(index)}>
                {t('Remover')}
              </Button>
            )}
          </HStack>
        </Stack>
      ))}
      <Button mt="4" variant="secondary" size="sm" onClick={addPhone}>
        {t('Adicionar telefone')}
      </Button>
    </Box>
  );
};
