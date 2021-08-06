import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useContextCourierProfile } from 'app/state/courier/context';
import { Order, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface ItemPros {
  order: WithId<Order>;
}

const CourierOrdersTableItem = ({ order }: ItemPros) => {
  // UI
  return (
    <Tr color="black" fontSize="xs">
      <Td>{order.code ?? 'N/E'}</Td>
      <Td>
        {order.confirmedOn ? getDateAndHour(order.confirmedOn) : getDateAndHour(order.updatedOn)}
      </Td>
      <Td>{order.type === 'food' ? 'Comida' : 'p2p'}</Td>
      <Td>{order.business?.name ?? 'N/I'}</Td>
      <Td>{order.fare?.courier.value ? formatCurrency(order.fare?.courier.value) : 'N/E'}</Td>
      <Td>
        <CustomButton
          size="sm"
          variant="outline"
          label={t('Detalhes')}
          link={`/backoffice/orders/${order.id}`}
        />
      </Td>
    </Tr>
  );
};

export const CourierOrders = () => {
  // context
  const { orders, dateStart, dateEnd, setDateStart, setDateEnd } = useContextCourierProfile();
  // helpers
  const totalOrders = orders?.length ?? '0';
  // UI
  return (
    <Box>
      <SectionTitle>{t('Filtrar por período')}</SectionTitle>
      <CustomDateFilter mt="4" getStart={setDateStart} getEnd={setDateEnd} showWarning />
      {!dateStart || !dateEnd ? (
        <Text mt="4">{t('Selecione as datas que deseja buscar')}</Text>
      ) : !orders ? (
        <Text mt="4">{t('Carregando...')}</Text>
      ) : (
        <Box>
          <Text mt="4" fontSize="20px" lineHeight="26px" color="black">
            {`${totalOrders} corridas realizadas`}
          </Text>
          <Table mt="4" size="md" variant="simple">
            <Thead>
              <Tr>
                <Th>{t('ID')}</Th>
                <Th>{t('Data')}</Th>
                <Th>{t('tipo')}</Th>
                <Th>{t('Restaurante')}</Th>
                <Th>{t('Valor')}</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => {
                  return <CourierOrdersTableItem key={order.id} order={order} />;
                })
              ) : (
                <Tr color="black" fontSize="xs" fontWeight="700">
                  <Td>{t('Não há registro de corridas.')}</Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};
