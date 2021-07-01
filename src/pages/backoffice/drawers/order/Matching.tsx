import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { useObserveOrderMatching } from 'app/api/order/useObserveOrderMatching';
import { OrderStatus } from 'appjusto-types';
import { DispatchingStatus } from 'appjusto-types/order/dispatching';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import React from 'react';
import { t } from 'utils/i18n';
import { orderDispatchingStatusPTOptions } from '../../utils/index';
import { SectionTitle } from '../generics/SectionTitle';
import { CourierNotifiedBox } from './matching/CourierNotifiedBox';
import { LogsTable } from './matching/LogsTable';

interface MatchingProps {
  orderId?: string;
  orderStatus?: OrderStatus;
  orderDispatchingStatus?: DispatchingStatus;
}

export const Matching = ({ orderId, orderStatus, orderDispatchingStatus }: MatchingProps) => {
  // context
  const {
    matching,
    updateCourierNotified,
    updateResult,
    restartMatching,
    restartResult,
  } = useObserveOrderMatching(orderId);
  // state
  const [logs, setLogs] = React.useState<string[]>();
  const [attemps, setAttemps] = React.useState<number>(0);
  const [couriersNotified, setCouriersNotified] = React.useState<string[]>();
  const [courierRemoving, setCourierRemoving] = React.useState<string | null>(null);
  const [isRestarting, setIsRestarting] = React.useState<boolean>(false);
  const [error, setError] = React.useState(initialError);
  //const [couriersRejections, setCouriersRejections] = React.useState<OrderMatchingRejection[]>();

  // refs
  const submission = React.useRef(0);

  // helpers
  const isOrderActive = orderStatus
    ? ['confirmed', 'preparing', 'ready', 'dispatching'].includes(orderStatus)
    : false;
  const isNoMatch = orderDispatchingStatus === 'no-match';
  const getDispacthingStatus = () => {
    if (!orderDispatchingStatus) return 'N/E';
    if (orderDispatchingStatus === 'matching') {
      if (logs && logs.length > 0) return 'Buscando';
      else return 'Ocioso';
    }
    return orderDispatchingStatusPTOptions[orderDispatchingStatus];
  };

  // handlers
  const removeCourierNotified = async (courierId: string) => {
    submission.current += 1;
    setCourierRemoving(courierId);
    const newArray = couriersNotified?.filter((id) => id !== courierId);
    await updateCourierNotified(newArray);
    setCourierRemoving(null);
  };

  // side effects
  React.useEffect(() => {
    if (matching === undefined) return;
    if (matching === null) {
      setCouriersNotified([]);
      //setCouriersRejections([]);
      setLogs([]);
      return;
    }
    setCouriersNotified(matching.couriersNotified);
    //setCouriersRejections(matching.rejections);
    setLogs(matching.logs);
  }, [matching]);

  React.useEffect(() => {
    if (!logs) return;
    const hashNumber = logs.map((log) => log.split(' ')[0]);
    const AttempsCounter = (array: string[]) => {
      let total = 0;
      array.forEach((item, index) => {
        if (item !== array[index - 1]) return (total += 1);
      });
      return total;
    };
    const result = AttempsCounter(hashNumber);
    setAttemps(result);
  }, [logs]);

  React.useEffect(() => {
    if (restartResult.isSuccess) setIsRestarting(false);
  }, [restartResult]);

  React.useEffect(() => {
    if (updateResult.isError)
      setError({
        status: true,
        error: updateResult.error,
      });
    if (restartResult.isError)
      setError({
        status: true,
        error: restartResult.error,
      });
  }, [updateResult.isError, updateResult.error, restartResult.isError, restartResult.error]);

  // UI
  return (
    <>
      <Flex justifyContent="space-between">
        <SectionTitle mt="2">
          {t('Status:')}{' '}
          <Text as="span" color={isNoMatch ? 'red' : 'black'}>
            {getDispacthingStatus()}
          </Text>
        </SectionTitle>
        {orderDispatchingStatus === 'no-match' &&
          (isRestarting ? (
            <Flex
              w="60%"
              flexDir="column"
              bg="rgba(254, 215, 215, 0.3)"
              borderRadius="lg"
              py="2"
              px="4"
            >
              <Text textAlign="center">{t('Confirmar reinicialização?')}</Text>
              <HStack mt="2" spacing={2}>
                <CustomButton
                  mt="0"
                  h="30px"
                  size="sm"
                  variant="danger"
                  label="Cancelar"
                  onClick={() => setIsRestarting(false)}
                />
                <CustomButton
                  mt="0"
                  h="30px"
                  size="sm"
                  label="Confirmar"
                  onClick={() => {
                    submission.current += 1;
                    restartMatching();
                  }}
                  isLoading={restartResult.isLoading}
                />
              </HStack>
            </Flex>
          ) : (
            <CustomButton
              mt="2"
              h="48px"
              size="sm"
              variant="dangerLight"
              label="Reiniciar matching"
              onClick={() => setIsRestarting(true)}
            />
          ))}
      </Flex>
      <SectionTitle mt={isNoMatch ? '2' : '8'}>{t('Tentativas: ') + attemps}</SectionTitle>
      <SectionTitle>{t('Entregadores notificados')}</SectionTitle>
      <Box
        mt="4"
        p="2"
        minH="200px"
        maxH="300px"
        overflowY="scroll"
        border="1px solid #ECF0E3"
        borderRadius="lg"
      >
        {!couriersNotified ? (
          <Text>{t('Carregando dados...')}</Text>
        ) : (
          couriersNotified.map((courierId) => (
            <CourierNotifiedBox
              key={courierId}
              isOrderActive={isOrderActive}
              courierId={courierId}
              removeCourier={removeCourierNotified}
              courierRemoving={courierRemoving}
              isLoading={updateResult.isLoading}
            />
          ))
        )}
      </Box>
      <SectionTitle>{t('Logs do pedido')}</SectionTitle>
      <Box mt="4" maxH="300px" overflowY="scroll" border="1px solid #ECF0E3" borderRadius="lg">
        <LogsTable logs={logs} />
      </Box>
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={updateResult.isSuccess || restartResult.isSuccess}
        isError={error.status}
        error={error.error}
      />
    </>
  );
};
