import { Box } from '@chakra-ui/react';
import * as cnpjutils from '@fnando/cnpj';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { CustomPatternInput as PatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { cnpjFormatter, cnpjMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { CuisineSelect } from 'common/components/form/select/CuisineSelect';
import React from 'react';
import { t } from 'utils/i18n';

export const BOBusinessProfile = () => {
  // context
  const { business, handleBusinessProfileChange: handleChange } = useContextBusinessBackoffice();
  // helpers
  const isCNPJValid = () => (business?.cnpj ? cnpjutils.isValid(business.cnpj) : false);
  // UI
  return (
    <Box>
      <PatternInput
        isRequired
        // isDisabled={business?.situation === 'approved'}
        id="business-cnpj"
        label={t('CNPJ *')}
        placeholder={t('CNPJ do seu estabelecimento')}
        mask={cnpjMask}
        parser={numbersOnlyParser}
        formatter={cnpjFormatter}
        value={business?.cnpj ?? ''}
        onValueChange={(value) => handleChange('cnpj', value)}
        externalValidation={{ active: true, status: isCNPJValid() }}
      />
      <Input
        isRequired
        id="business-name"
        label={t('Nome do restaurante *')}
        placeholder={t('Digite o nome do restaurante')}
        value={business?.name ?? ''}
        onChange={(ev) => handleChange('name', ev.target.value)}
      />
      <Input
        isRequired
        id="business-company-name"
        label={t('Razão social *')}
        placeholder={t('Apenas para conferência')}
        value={business?.companyName ?? ''}
        onChange={(ev) => handleChange('companyName', ev.target.value)}
      />
      <CuisineSelect
        isRequired
        value={business?.cuisine ?? ''}
        onChange={(ev) => handleChange('cuisine', ev.target.value)}
      />
      <Textarea
        isRequired
        id="business-description"
        label={t('Descrição *')}
        placeholder={t('Descreva seu restaurante')}
        value={business?.description ?? ''}
        onChange={(ev) => handleChange('description', ev.target.value)}
      />
      <CurrencyInput
        isRequired
        id="business-min-price"
        label={t('Valor mínimo do pedido')}
        placeholder={t('R$ 0,00')}
        value={business?.minimumOrder ?? 0}
        onChangeValue={(value) => handleChange('minimumOrder', value)}
        maxLength={8}
      />
    </Box>
  );
};
