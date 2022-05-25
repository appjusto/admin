import { Box, HStack, Text } from '@chakra-ui/react';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export interface IuguCustomerPaymentMethod {
  id: string;
  description: string;
  item_type: 'credit_card';
  data: {
    brand: string; // VISA, MASTERCARD, ...
    display_number: string; // XXXX-XXXX-XXXX-1111
    last_digits: string;
    holder_name: string;
    month: number;
    year: number;
  };
}

interface PaymentMethodCardProps {
  method: IuguCustomerPaymentMethod;
}

const PaymentMethodCard = ({ method }: PaymentMethodCardProps) => {
  return (
    <Box mt="4" border="1px solid #E5E5E5" borderRadius="lg" p="4">
      <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('ID:')}{' '}
        <Text as="span" fontWeight="500">
          {method.id ?? 'N/E'}
        </Text>
      </Text>
      <HStack spacing={4}>
        <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Tipo:')}{' '}
          <Text as="span" fontWeight="500">
            {method.description ?? 'N/E'}
          </Text>
        </Text>
        <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Bandeira:')}{' '}
          <Text as="span" fontWeight="500">
            {method.data.brand ?? 'N/E'}
          </Text>
        </Text>
      </HStack>
      <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Nome:')}{' '}
        <Text as="span" fontWeight="500">
          {method.data.holder_name ?? 'N/E'}
        </Text>
      </Text>
      <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Número:')}{' '}
        <Text as="span" fontWeight="500">
          {method.data.display_number ?? 'N/E'}
        </Text>
      </Text>
      <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Vencimento:')}{' '}
        <Text as="span" fontWeight="500">
          {`${method.data.month ?? 'N/E'}/${method.data.year ?? 'N/E'}`}
        </Text>
      </Text>
    </Box>
  );
};

export const PaymentMethods = () => {
  // context
  const { consumer } = useContextConsumerProfile();
  // UI
  return (
    <Box>
      <SectionTitle mt="0">{t('Métodos de pagamento:')}</SectionTitle>
      {consumer?.paymentChannel?.methods ? (
        consumer?.paymentChannel?.methods.map((method) => (
          <PaymentMethodCard key={method.id} method={method} />
        ))
      ) : (
        <Text>{t('Ainda não há métodos de pagamento cadastrados')}</Text>
      )}
    </Box>
  );
};
