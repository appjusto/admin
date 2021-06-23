import { Box, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Dates, useContextCourierProfile } from 'app/state/courier/context';
import { Order, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
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
      <Td>{getDateAndHour(order.createdOn)}</Td>
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
  const { orders, dates, setDates } = useContextCourierProfile();
  // helpers
  const totalOrders = orders?.length ?? '0';
  // UI
  return (
    <Box>
      <SectionTitle>{t('Filtrar por período')}</SectionTitle>
      <HStack mt="4" spacing={4}>
        <CustomInput
          mt="0"
          type="date"
          id="search-name"
          value={dates?.start ?? ''}
          onChange={(event) =>
            //@ts-ignore
            setDates((prev: Dates) => {
              return {
                ...prev,
                start: event.target.value,
              };
            })
          }
          label={t('De')}
        />
        <CustomInput
          mt="0"
          type="date"
          id="search-name"
          value={dates?.end ?? ''}
          onChange={(event) =>
            //@ts-ignore
            setDates((prev: Dates) => {
              return {
                ...prev,
                end: event.target.value,
              };
            })
          }
          label={t('Até')}
        />
      </HStack>
      {!dates ? (
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
