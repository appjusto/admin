import { Order, WithId } from '@appjusto/types';
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useReleaseCourier } from 'app/api/courier/useReleaseCourier';
import { useContextCourierProfile } from 'app/state/courier/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
      <Td>
        <Link as={RouterLink} to={`/backoffice/orders/${order.id}`}>
          {order.code ?? 'N/E'}
        </Link>
      </Td>
      <Td>{getDateAndHour(order.timestamps?.confirmed)}</Td>
      <Td>{order.type === 'food' ? 'Comida' : 'p2p'}</Td>
      <Td>{order.business?.name ?? 'N/I'}</Td>
      <Td>{order.fare?.courier?.value ? formatCurrency(order.fare.courier.value) : 'N/E'}</Td>
    </Tr>
  );
};

export const CourierOrders = () => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { releaseCourier, releaseCourierResult } = useReleaseCourier();
  const { courier, currentOrder, orders, dateStart, dateEnd, setDateStart, setDateEnd } =
    useContextCourierProfile();
  // state
  const [release, setRelease] = React.useState(false);
  const [releaseComment, setReleaseComment] = React.useState('');
  // helpers
  const totalOrders = orders?.length ?? '0';
  const orderType = currentOrder?.type
    ? currentOrder.type === 'food'
      ? 'Comida'
      : 'Entrega'
    : 'N/E';
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
      {currentOrder && (
        <Box mb="6">
          <SectionTitle>{t('Agora com o pedido:')}</SectionTitle>
          <Flex
            mt="4"
            flexDir={{ base: 'column', md: release ? 'column' : 'row' }}
            justifyContent="space-between"
            p="4"
            border="1px solid #C8D7CB"
            borderRadius="lg"
          >
            <HStack spacing={4}>
              <Text color="black" fontSize="26px" fontWeight="500" lineHeight="28px">
                #{currentOrder?.code ?? 'N/E'}
              </Text>
              <Box>
                <Text fontSize="13px" fontWeight="500" lineHeight="12px" color="green.600">
                  {orderType}
                </Text>
                {currentOrder?.type === 'food' && (
                  <Text fontSize="16px" fontWeight="500" lineHeight="18px">
                    {currentOrder?.business?.name ?? 'N/E'}
                  </Text>
                )}
              </Box>
            </HStack>
            {release ? (
              <Box mt="4" minW="348px" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="4">
                <Text color="red">{t(`Se deseja confirmar, informe o motivo da liberação:`)}</Text>
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
                  >
                    {t(`Liberar`)}
                  </Button>
                </HStack>
              </Box>
            ) : (
              <Stack
                mt={{ base: '4', md: '0' }}
                spacing={4}
                direction={{ base: 'column', md: 'row' }}
              >
                <CustomButton
                  mt="0"
                  w="100%"
                  minW="166px"
                  size="md"
                  variant="outline"
                  label={t('Ver pedido')}
                  link={`/backoffice/orders/${currentOrder?.id}`}
                />
                <Button size="md" variant="dangerLight" onClick={() => setRelease(true)}>
                  {t('Liberar entregador')}
                </Button>
              </Stack>
            )}
          </Flex>
        </Box>
      )}
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
        </Box>
      )}
    </Box>
  );
};
