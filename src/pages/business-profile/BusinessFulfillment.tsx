import { Fulfillment } from '@appjusto/types';
import { Box, Checkbox, CheckboxGroup, HStack, Text } from '@chakra-ui/react';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import { t } from 'utils/i18n';

interface FulfillmentProps {
  fulfillment?: Fulfillment[];
  handleChange: (value: Fulfillment[]) => void;
  isBackoffice?: boolean;
}

export const BusinessFulfillment = ({
  fulfillment,
  handleChange,
  isBackoffice,
}: FulfillmentProps) => {
  return (
    <Box>
      <SectionTitle>{t('Tipos de entrega')}</SectionTitle>
      {!isBackoffice && (
        <Text mt="2" fontSize="md">
          {t('Selecione os tipos de entrega que o restaurante oferece')}
        </Text>
      )}
      <CheckboxGroup
        colorScheme="green"
        value={fulfillment}
        onChange={(values: Fulfillment[]) => handleChange(values)}
      >
        <HStack
          mt="4"
          alignItems="flex-start"
          color="black"
          spacing={8}
          fontSize="16px"
          lineHeight="22px"
        >
          <Checkbox value="delivery">{t('Delivery')}</Checkbox>
          <Checkbox value="take-away">{t('Para retirar')}</Checkbox>
        </HStack>
      </CheckboxGroup>
    </Box>
  );
};
