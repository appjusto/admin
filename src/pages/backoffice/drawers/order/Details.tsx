import { Box, Table, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { Order, OrderItem, WithId } from 'appjusto-types';
import React from 'react';
import { itemPriceFormatter } from 'utils/formatters';
import { getOrderTotalPriceToDisplay } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface DetailsProps {
  order?: WithId<Order> | null;
}

export const Details = ({ order }: DetailsProps) => {
  // state
  const [totalPrice, setTotalPrice] = React.useState<string>();

  // side effects
  React.useEffect(() => {
    if (order?.type === 'food') setTotalPrice(getOrderTotalPriceToDisplay(order?.items || []));
    else setTotalPrice(itemPriceFormatter(order?.fare?.consumer.total ?? 0));
  }, [order?.type, order?.items]);

  // UI
  return (
    <Box>
      {order?.type === 'food' && (
        <>
          <SectionTitle mt="10">{t('Detalhes do pedido')}</SectionTitle>
          <Table size="md" variant="simple">
            <Thead>
              <Tr>
                <Th>{t('Item')}</Th>
                <Th isNumeric>{t('Qtde.')}</Th>
                <Th isNumeric>{t('Valor/Item')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {order?.items?.map((item: OrderItem) => (
                <React.Fragment key={Math.random()}>
                  <Tr color="black" fontSize="xs" fontWeight="700">
                    <Td>{item.product.name}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>{itemPriceFormatter(item.product.price * item.quantity)}</Td>
                  </Tr>
                  {item.complements &&
                    item.complements.map((complement) => (
                      <Tr key={Math.random()} fontSize="xs">
                        <Td>{complement.name}</Td>
                        <Td isNumeric>1</Td>
                        <Td isNumeric>{itemPriceFormatter(complement.price)}</Td>
                      </Tr>
                    ))}
                </React.Fragment>
              ))}
            </Tbody>
            <Tfoot bgColor="gray.50">
              <Tr color="black">
                <Th>{t('Valor total de itens:')}</Th>
                <Th></Th>
                <Th isNumeric>{totalPrice}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </>
      )}
      <SectionTitle mt="10">{t('Observações')}</SectionTitle>
      <Text mt="1" fontSize="md">
        {t('Incluir CPF na nota, CPF: 000.000.000-00')}
      </Text>
      <SectionTitle mt="10">{t('Forma de pagamento')}</SectionTitle>
      <Text mt="1" fontSize="md">
        {t('Total pago:')}{' '}
        <Text as="span" color="black">
          {totalPrice}
        </Text>
      </Text>
      <Text mt="1" fontSize="md">
        {t('Método de pagamento:')}{' '}
        <Text as="span" color="black">
          N/I
        </Text>
      </Text>
    </Box>
  );
};
