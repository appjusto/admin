import { Box, Table, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { Order, OrderItem, WithId } from 'appjusto-types';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../../backoffice/drawers/generics/SectionTitle';

interface OrderToPrintProps {
  order?: WithId<Order>;
}

export const OrderToPrint = ({ order }: OrderToPrintProps) => {
  // UI
  return (
    <Box>
      <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
        {t('Pedido Nº')} {order?.code}
      </Text>
      <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
        {t('Nome do cliente:')}{' '}
        <Text as="span" color="black" fontWeight="700">
          {order?.consumer?.name ?? 'N/E'}
        </Text>
      </Text>
      <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
        {t('Horário do pedido:')}{' '}
        <Text as="span" color="black" fontWeight="700">
          {getDateAndHour(order?.confirmedOn)}
        </Text>
      </Text>
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
    </Box>
  );
};
