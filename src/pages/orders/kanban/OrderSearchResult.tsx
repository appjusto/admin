import { Order, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router-dom';
import {
  getDateAndHour,
  getOrderTotalPriceToDisplay,
  getTranslatedOrderStatus,
} from 'utils/functions';
import { t } from 'utils/i18n';

interface OrderSearchProps {
  orders: WithId<Order>[];
}

export const OrderSearchResult = ({ orders }: OrderSearchProps) => {
  // context
  const { url } = useRouteMatch();
  // UI
  return (
    <Box mt="8">
      <Text fontWeight="700" color="black">
        {t('Resultados da busca:')}
      </Text>
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('Nº')}</Th>
            <Th>{t('Data/Horário')}</Th>
            <Th>{t('Agendado para')}</Th>
            <Th>{t('Status')}</Th>
            <Th>{t('Entregador')}</Th>
            <Th isNumeric>{t('Valor total')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => {
              return (
                <Tr key={order.code} color="black" fontSize="xs">
                  <Td maxW="120px">{order.code}</Td>
                  <Td>{getDateAndHour(order.createdOn)}</Td>
                  <Td>
                    {order.scheduledTo
                      ? getDateAndHour(order.scheduledTo)
                      : 'Tempo real'}
                  </Td>
                  <Td>{getTranslatedOrderStatus(order.status)}</Td>
                  <Td>{order.courier?.name ?? t('Sem entregador')}</Td>
                  <Td isNumeric>
                    {getOrderTotalPriceToDisplay(order.items ?? [])}
                  </Td>
                  <Td>
                    <CustomButton
                      mt="0"
                      label={t('Detalhes')}
                      link={`${url}/${order.id}`}
                      size="sm"
                      variant="outline"
                    />
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Sem resultados para o número informado')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td isNumeric></Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
