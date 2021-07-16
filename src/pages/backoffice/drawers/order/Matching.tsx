import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { useObserveOrderMatching } from 'app/api/order/useObserveOrderMatching';
import { useOrderCourierManualAllocation } from 'app/api/order/useOrderCourierManualAllocation';
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
  orderId: string;
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
  const { courierManualAllocation, allocationResult } = useOrderCourierManualAllocation();
  // state
  //const [isAuto, setIsAuto] = React.useState(true);
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
  const getDispatchingStatus = () => {
    if (!orderDispatchingStatus) return 'N/E';
    if (orderDispatchingStatus === 'matching') {
      if (logs && logs.length > 0) return 'Buscando';
      else return 'Ocioso';
    }
    return orderDispatchingStatusPTOptions[orderDispatchingStatus];
  };

  // handlers
  const removeCourierNotified = async (courierId: string) => {
    setError(initialError);
    submission.current += 1;
    setCourierRemoving(courierId);
    const newArray = couriersNotified?.filter((id) => id !== courierId);
    await updateCourierNotified(newArray);
    setCourierRemoving(null);
  };

  const allocateCourier = (courierId: string, comment: string) => {
    setError(initialError);
    submission.current += 1;
    return courierManualAllocation({ orderId, courierId, comment });
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
    if (allocationResult.isError)
      setError({
        status: true,
        error: null,
        message: { title: 'Operação negada!', description: `${allocationResult.error}` },
      });
  }, [
    updateResult.isError,
    updateResult.error,
    restartResult.isError,
    restartResult.error,
    allocationResult.isError,
    allocationResult.error,
  ]);

  // UI
  return (
    <>
      <Flex justifyContent="space-between">
        <SectionTitle mt="2">
          {t('Status:')}{' '}
          <Text as="span" color={isNoMatch ? 'red' : 'black'}>
            {getDispatchingStatus()}
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
      <SectionTitle mt={isNoMatch ? '2' : '4'}>{t('Tentativas: ') + attemps}</SectionTitle>
      {/*<Flex
        my="8"
        fontSize="lg"
        flexDir="row"
        alignItems="flex-start"
        height="38px"
        borderBottom="1px solid #C8D7CB"
      >
        <Text
          pb="2"
          px="4"
          mr="4"
          fontSize="lg"
          fontWeight="500"
          cursor="pointer"
          _hover={{ textDecor: 'none' }}
          _focus={{ boxShadow: 'none' }}
          borderBottom={isAuto ? '4px solid #78E08F' : 'none'}
          onClick={() => setIsAuto(true)}
        >
          {t('Automático')}
        </Text>
        <Text
          pb="2"
          px="4"
          mr="4"
          fontSize="lg"
          fontWeight="500"
          cursor="pointer"
          _hover={{ textDecor: 'none' }}
          _focus={{ boxShadow: 'none' }}
          borderBottom={!isAuto ? '4px solid #78E08F' : 'none'}
          onClick={() => setIsAuto(false)}
        >
          {t('Manual')}
        </Text>
      </Flex>*/}
      <Box>
        <SectionTitle mt="4">{t('Entregadores notificados')}</SectionTitle>
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
                orderId={orderId}
                isOrderActive={isOrderActive}
                courierId={courierId}
                dispatchingStatus={orderDispatchingStatus}
                removeCourier={removeCourierNotified}
                allocateCourier={allocateCourier}
                courierRemoving={courierRemoving}
                isLoading={updateResult.isLoading || allocationResult.isLoading}
              />
            ))
          )}
        </Box>
        <SectionTitle>{t('Logs do pedido')}</SectionTitle>
        <Box mt="4" maxH="300px" overflowY="scroll" border="1px solid #ECF0E3" borderRadius="lg">
          <LogsTable logs={logs} />
        </Box>
      </Box>
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={updateResult.isSuccess || restartResult.isSuccess || allocationResult.isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </>
  );
};
