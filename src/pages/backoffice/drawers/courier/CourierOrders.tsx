import {
  Box,
  Button,
  Flex,
  HStack,
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
import { FirebaseError } from 'app/api/types';
import { useContextCourierProfile } from 'app/state/courier/context';
import { Order, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
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
  const { releaseCourier, releaseCourierResult } = useReleaseCourier();
  const {
    courier,
    currentOrder,
    orders,
    dateStart,
    dateEnd,
    setDateStart,
    setDateEnd,
  } = useContextCourierProfile();
  // state
  const [release, setRelease] = React.useState(false);
  const [releaseComment, setReleaseComment] = React.useState('');
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
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
    submission.current += 1;
    if (!releaseComment) {
      return setError({
        status: true,
        error: null,
        message: { title: 'Informe o motivo da liberação' },
      });
    }
    releaseCourier({ courierId: courier.id, comment: releaseComment });
  };
  // side effects
  React.useEffect(() => {
    setReleaseComment('');
  }, [release]);
  React.useEffect(() => {
    if (releaseCourierResult.isError) {
      const errorMessage = (releaseCourierResult.error as FirebaseError).message;
      setError({
        status: true,
        error: releaseCourierResult.error,
        message: { title: errorMessage ?? 'Não foi possível acessar o servidor' },
      });
    }
  }, [releaseCourierResult.isError, releaseCourierResult.error]);
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
              <HStack spacing={4}>
                <CustomButton
                  mt="0"
                  minW="166px"
                  size="md"
                  variant="outline"
                  label={t('Ver pedido')}
                  link={`/backoffice/orders/${currentOrder?.id}`}
                />
                <Button size="md" variant="dangerLight" onClick={() => setRelease(true)}>
                  {t('Liberar entregador')}
                </Button>
              </HStack>
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
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={releaseCourierResult.isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </Box>
  );
};
