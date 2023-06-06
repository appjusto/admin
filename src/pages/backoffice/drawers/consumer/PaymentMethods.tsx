import { IuguCard, WithId } from '@appjusto/types';
import { Box, HStack, Text } from '@chakra-ui/react';
import { useFetchCardsByAccountId } from 'app/api/cards/useFetchCardsByAccountId';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export interface IuguCustomerPaymentMethod {
  id: string;
  description: string;
  item_type: 'credit_card';
  data: {
    brand: string;
    display_number: string;
    last_digits: string;
    holder_name: string;
    month: number;
    year: number;
  };
}

interface PaymentMethodCardProps {
  method: IuguCustomerPaymentMethod | string;
}

export const PaymentMethodCard = ({ method }: PaymentMethodCardProps) => {
  if (typeof method === 'string') {
    return (
      <Text
        mt="4"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Pago por:')}{' '}
        <Text as="span" fontWeight="500">
          {method ?? 'N/E'}
        </Text>
      </Text>
    );
  }
  return (
    <Box mt="4" border="1px solid #E5E5E5" borderRadius="lg" p="4">
      {/* <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('ID:')}{' '}
        <Text as="span" fontWeight="500">
          {method.id ?? 'N/E'}
        </Text>
      </Text> */}
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
  const cards = useFetchCardsByAccountId(consumer?.id);
  // UI
  return (
    <Box>
      <SectionTitle mt="0">{t('Métodos de pagamento:')}</SectionTitle>
      {cards === undefined ? (
        <Text>{t('Carregando métodos de pagamento...')}</Text>
      ) : cards === null ? (
        <Text>{t('Ainda não há métodos de pagamento cadastrados')}</Text>
      ) : (
        cards.map((card) => (
          <PaymentMethodCard
            key={card.id}
            method={(card as WithId<IuguCard>).token ?? 'credit_card'}
          />
        ))
      )}
    </Box>
  );
};
