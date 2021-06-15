import { Box, Table, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { Order, OrderItem, WithId } from 'appjusto-types';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../../backoffice/drawers/generics/SectionTitle';

interface DetailsProps {
  order?: WithId<Order> | null;
}

export const OrderDetails = ({ order }: DetailsProps) => {
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
                    <Td>
                      {item.product.name} <br />
                      <Text as="span" color="red" fontWeight="500">
                        {item.notes}
                      </Text>
                    </Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>{formatCurrency(item.product.price)}</Td>
                  </Tr>
                  {item.complements &&
                    item.complements.map((complement) => (
                      <Tr key={Math.random()} fontSize="xs">
                        <Td>{complement.name}</Td>
                        <Td isNumeric>{item.quantity}</Td>
                        <Td isNumeric>{formatCurrency(complement.price)}</Td>
                      </Tr>
                    ))}
                </React.Fragment>
              ))}
            </Tbody>
            <Tfoot bgColor="gray.50">
              <Tr color="black">
                <Th>{t('Valor total de itens:')}</Th>
                <Th></Th>
                <Th isNumeric>
                  {order?.fare?.business?.value ? formatCurrency(order.fare.business.value) : 0}
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </>
      )}
      <SectionTitle mt="10">{t('Observações')}</SectionTitle>
      {order?.consumer.cpf && (
        <Text mt="1" fontSize="md" color="red">
          {t(`Incluir CPF na nota, CPF: ${cpfutils.format(order.consumer.cpf)}`)}
        </Text>
      )}
      {order?.additionalInfo && (
        <Text mt="1" fontSize="md" color="red">
          {order?.additionalInfo}
        </Text>
      )}
      {!order?.consumer.cpf && !order?.additionalInfo && (
        <Text mt="1" fontSize="md">
          {t('Sem observações.')}
        </Text>
      )}
      {order?.status !== 'canceled' && (
        <>
          <SectionTitle mt="10">{t('Forma de pagamento')}</SectionTitle>
          <Text mt="1" fontSize="md">
            {t('Valor do frete:')}{' '}
            <Text as="span" color="black">
              {order?.fare?.courier.value ? formatCurrency(order.fare.courier.value) : 'N/E'}
            </Text>
          </Text>
          <Text mt="1" fontSize="md">
            {t('Total pago:')}{' '}
            <Text as="span" color="black">
              {order?.fare?.total ? formatCurrency(order.fare.total) : 0}
            </Text>
          </Text>
          <Text mt="1" fontSize="md">
            {t('Método de pagamento:')}{' '}
            <Text as="span" color="black">
              {t('cartão de crédito')}
            </Text>
          </Text>
        </>
      )}
    </Box>
  );
};
