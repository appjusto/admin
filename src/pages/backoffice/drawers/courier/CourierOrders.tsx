import { Order, WithId } from '@appjusto/types';
import {
  Box,
  Button,
  HStack,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useReleaseCourier } from 'app/api/courier/useReleaseCourier';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextCourierProfile } from 'app/state/courier/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { CurrentOrderCard } from './CurrentOrderCard';

interface ItemPros {
  order: WithId<Order>;
}

const CourierOrdersTableItem = ({ order }: ItemPros) => {
  // UI
  return (
    <Tr color="black" fontSize="xs">
      <Td>
        <Link as={RouterLink} to={`/backoffice/orders/${order.id}`}>
          {order.code ?? 'N/E'}
        </Link>
      </Td>
      <Td>{getDateAndHour(order.timestamps?.confirmed)}</Td>
      <Td>{order.type === 'food' ? 'Comida' : 'p2p'}</Td>
      <Td>{order.business?.name ?? 'N/I'}</Td>
      <Td>
        {order.fare?.courier?.netValue
          ? formatCurrency(order.fare?.courier.netValue)
          : 'N/E'}
      </Td>
    </Tr>
  );
};

export const CourierOrders = () => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { releaseCourier, releaseCourierResult } = useReleaseCourier();
  const {
    courier,
    currentOrders,
    orders,
    dateStart,
    dateEnd,
    setDateStart,
    setDateEnd,
  } = useContextCourierProfile();
  // state
  const [release, setRelease] = React.useState(false);
  const [releaseComment, setReleaseComment] = React.useState('');
  // helpers
  const totalOrders = orders?.length ?? '0';
  const totalOrdersValue = React.useMemo(() => {
    if (!orders) return 0;
    return orders.reduce((result, order) => {
      return (result += order.fare?.courier?.netValue ?? 0);
    }, 0);
  }, [orders]);
  // handlers
  const handleReleaseCourier = () => {
    if (!courier?.id) return;
    if (!releaseComment) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'courier-orders-handleReleaseCourier-valid',
        message: { title: 'Informe o motivo da liberação' },
      });
    }
    releaseCourier({ courierId: courier.id, comment: releaseComment });
  };
  // side effects
  React.useEffect(() => {
    setReleaseComment('');
  }, [release]);
  // UI
  return (
    <Box>
      {release ? (
        <Box
          mt="4"
          minW="348px"
          bg="#FFF8F8"
          border="1px solid red"
          borderRadius="lg"
          p="4"
        >
          <Text color="red">
            {t(`Se deseja confirmar, informe o motivo da liberação:`)}
          </Text>
          <Textarea
            mt="2"
            bg="white"
            borderColor="#C8D7CB"
            value={releaseComment}
            onChange={(e) => setReleaseComment(e.target.value)}
          />
          <HStack mt="2" spacing={4}>
            <Button width="full" size="md" onClick={() => setRelease(false)}>
              {t(`Manter`)}
            </Button>
            <Button
              width="full"
              size="md"
              variant="danger"
              onClick={handleReleaseCourier}
              isLoading={releaseCourierResult.isLoading}
              loadingText={t('Liberando...')}
            >
              {t('Liberar')}
            </Button>
          </HStack>
        </Box>
      ) : (
        <Button
          size="md"
          variant="dangerLight"
          onClick={() => setRelease(true)}
          display={userAbility?.can('update', 'couriers') ? 'initial' : 'none'}
        >
          {t('Liberar entregador')}
        </Button>
      )}
      {currentOrders.length > 0 && (
        <>
          <SectionTitle>{t('Pedidos ativos')}</SectionTitle>
          {currentOrders.map((order) => (
            <CurrentOrderCard
              key={order.id}
              courierId={courier?.id}
              order={order}
            />
          ))}
        </>
      )}
      <SectionTitle>{t('Filtrar por período')}</SectionTitle>
      <CustomDateFilter
        mt="4"
        getStart={setDateStart}
        getEnd={setDateEnd}
        showWarning
      />
      {!dateStart || !dateEnd ? (
        <Text mt="4">{t('Selecione as datas que deseja buscar')}</Text>
      ) : !orders ? (
        <Text mt="4">{t('Carregando...')}</Text>
      ) : (
        <Box>
          <Text mt="4" fontSize="20px" lineHeight="26px" color="black">
            {`${totalOrders} corridas realizadas`}
          </Text>
          <Box overflowX="auto">
            <Table mt="4" size="md" variant="simple">
              <Thead>
                <Tr>
                  <Th>{t('ID')}</Th>
                  <Th>{t('Data')}</Th>
                  <Th>{t('tipo')}</Th>
                  <Th>{t('Restaurante')}</Th>
                  <Th>{t('Valor')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => {
                    return (
                      <CourierOrdersTableItem key={order.id} order={order} />
                    );
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
              <Tfoot bgColor="gray.50">
                <Tr color="black" fontSize="xs" fontWeight="700">
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td>{t('Total recebido:')}</Td>
                  <Td>{formatCurrency(totalOrdersValue)}</Td>
                </Tr>
              </Tfoot>
            </Table>
          </Box>
        </Box>
      )}
    </Box>
  );
};
