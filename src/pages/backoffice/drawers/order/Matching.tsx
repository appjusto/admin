import { Order, OutsourceAccountType, WithId } from '@appjusto/types';
import { Box, Button, Flex, HStack, RadioGroup, Text } from '@chakra-ui/react';
import { useGetOutsourceDelivery } from 'app/api/order/useGetOutsourceDelivery';
import { useObserveOrderMatching } from 'app/api/order/useObserveOrderMatching';
import { useOrderCourierManualAllocation } from 'app/api/order/useOrderCourierManualAllocation';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import CustomRadio from 'common/components/form/CustomRadio';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { orderDispatchingStatusPTOptions } from '../../utils/index';
import { SectionTitle } from '../generics/SectionTitle';
import { CourierNotifiedBox } from './matching/CourierNotifiedBox';
import { LogsTable } from './matching/LogsTable';

export type NotifiedCouriers = { id: string; name?: string };

interface MatchingProps {
  order?: WithId<Order> | null;
}

export const Matching = ({ order }: MatchingProps) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { matching, logs, updateCourierNotified, updateResult, restartMatching, restartResult } =
    useObserveOrderMatching(order?.id);
  const { courierManualAllocation, allocationResult } = useOrderCourierManualAllocation();
  const {
    getOutsourceDelivery,
    outsourceDeliveryResult,
    updateOutsourcingCourierName,
    updateOutsourcingCourierNameResult,
  } = useGetOutsourceDelivery(order?.id);
  // state
  //const [isAuto, setIsAuto] = React.useState(true);
  // const [logs, setLogs] = React.useState<string[]>();
  const [attemps, setAttemps] = React.useState<number>(0);
  const [couriersNotified, setCouriersNotified] = React.useState<NotifiedCouriers[]>([]);
  const [courierRemoving, setCourierRemoving] = React.useState<string | null>(null);
  const [isRestarting, setIsRestarting] = React.useState<boolean>(false);
  const [isOutsourcing, setIsOutsourcing] = React.useState<boolean>(false);
  const [outsourcingAccountType, setOutsourcingAccountType] =
    React.useState<OutsourceAccountType>('platform');
  const [outsourcingCourierName, setOutsourcingCourierName] = React.useState<string>();
  //const [couriersRejections, setCouriersRejections] = React.useState<OrderMatchingRejection[]>();
  // helpers
  const isOrderActive = order?.status
    ? ['confirmed', 'preparing', 'ready', 'dispatching'].includes(order.status)
    : false;
  const isNoMatch = order?.dispatchingStatus === 'no-match';
  // handlers
  const removeCourierNotified = async (courierId: string) => {
    setCourierRemoving(courierId);
    const newArray = couriersNotified
      .filter((courier) => courier.id !== courierId)
      .map((courier) => courier.id);
    await updateCourierNotified(newArray);
    setCourierRemoving(null);
  };
  const allocateCourier = (courierId: string, comment: string) => {
    if (!order?.id) return;
    return courierManualAllocation({ orderId: order.id, courierId, comment });
  };
  // side effects
  React.useEffect(() => {
    if (matching === undefined) return;
    if (matching === null) {
      setCouriersNotified([]);
      //setCouriersRejections([]);
      // setLogs([]);
      return;
    }
    setCouriersNotified(matching.notifiedCouriers);
    //setCouriersRejections(matching.rejections);
    // setLogs(matching.logs);
    setAttemps(matching.attempt);
  }, [matching]);
  React.useEffect(() => {
    if (order?.dispatchingStatus === 'outsourced') setIsOutsourcing(true);
  }, [order?.dispatchingStatus]);
  React.useEffect(() => {
    if (restartResult.isSuccess) setIsRestarting(false);
  }, [restartResult]);
  React.useEffect(() => {
    if (!order?.courier?.name) setOutsourcingCourierName(undefined);
    else setOutsourcingCourierName(order?.courier?.name);
  }, [order?.courier?.name]);
  // UI
  return (
    <>
      {!isOutsourcing ? (
        <Button
          display={
            userAbility?.can('update', { kind: 'orders', ...order }) ? 'inline-block' : 'none'
          }
          h="38px"
          w="220px"
          size="sm"
          variant="yellowDark"
          onClick={() => setIsOutsourcing(true)}
          isDisabled={
            order?.dispatchingStatus
              ? ['matched', 'confirmed'].includes(order.dispatchingStatus)
              : true
          }
        >
          {t('Logística fora da rede')}
        </Button>
      ) : order?.dispatchingStatus === 'outsourced' ? (
        <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" bg="" p="4">
          <SectionTitle mt="0">{t('Logística fora da rede ativada')}</SectionTitle>
          <Text mt="4">
            {t('Responsável: ')}
            <Text as="span" fontWeight="700">
              {order.outsourcedBy === 'business' ? t('Restaurante') : t('Plataforma')}
            </Text>
          </Text>
          {isOrderActive && order.outsourcedBy !== 'business' && (
            <Text mt="2">
              {t('Será necessário finalizar o pedido quando o mesmo for entregue.')}
            </Text>
          )}
          <HStack mt="4">
            <CustomInput
              mt="0"
              id="out-courier-name"
              label={t('Nome do entregador')}
              value={outsourcingCourierName ?? ''}
              onChange={(ev) => setOutsourcingCourierName(ev.target.value)}
            />
            <Button
              h="60px"
              onClick={() => updateOutsourcingCourierName(outsourcingCourierName!)}
              isLoading={updateOutsourcingCourierNameResult.isLoading}
              isDisabled={!outsourcingCourierName || !isOrderActive}
            >
              {t('Salvar')}
            </Button>
          </HStack>
        </Box>
      ) : (
        <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" bg="" p="4">
          <SectionTitle mt="0">{t('Logística fora da rede')}</SectionTitle>
          <Text mt="2">
            {t(
              `Ao realizar a logística de entrega fora da rede, restaurante e consumidor não serão informados, pelo Admin/App, sobre a localização do entregador.`
            )}
          </Text>
          <HStack mt="6" spacing={4} bgColor="#f6f6f67b" borderRadius="lg" p="4">
            <Text fontWeight="700">{t(`O valor da entrega será destinado para:`)}</Text>
            <RadioGroup
              onChange={(value: OutsourceAccountType) => setOutsourcingAccountType(value)}
              value={outsourcingAccountType}
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <HStack spacing={6}>
                <CustomRadio value="platform">{t('Plataforma')}</CustomRadio>
                <CustomRadio value="business" isDisabled={order?.type === 'p2p'}>
                  {t('Restaurante')}
                </CustomRadio>
              </HStack>
            </RadioGroup>
          </HStack>
          <HStack mt="6" justifyContent="flex-end">
            <Button mt="0" variant="dangerLight" onClick={() => setIsOutsourcing(false)}>
              {t('Cancelar')}
            </Button>
            <Button
              mt="0"
              onClick={() => getOutsourceDelivery({ accountType: outsourcingAccountType })}
              isLoading={outsourceDeliveryResult.isLoading}
            >
              {t('Confirmar')}
            </Button>
          </HStack>
        </Box>
      )}
      <Flex mt="5" justifyContent="space-between">
        <SectionTitle mt="0">
          {t('Status:')}{' '}
          <Text as="span" color={isNoMatch ? 'red' : 'black'}>
            {order?.dispatchingStatus
              ? orderDispatchingStatusPTOptions[order.dispatchingStatus]
              : 'N/E'}
          </Text>
        </SectionTitle>
        {isOrderActive &&
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
                    restartMatching();
                  }}
                  isLoading={restartResult.isLoading}
                />
              </HStack>
            </Flex>
          ) : (
            <CustomButton
              mt="2"
              h="38px"
              size="sm"
              variant="dangerLight"
              label="Reiniciar matching"
              onClick={() => setIsRestarting(true)}
            />
          ))}
      </Flex>
      <SectionTitle mt={isNoMatch ? '2' : '4'}>{t('Tentativas: ') + attemps}</SectionTitle>
      <Box>
        <SectionTitle mt="4">
          {t(`Entregadores notificados: ${couriersNotified ? couriersNotified.length : 0}`)}
        </SectionTitle>
        {process.env.REACT_APP_FIREBASE_EMULATOR && (
          <Button
            mt="4"
            h="38px"
            w="300px"
            size="sm"
            onClick={() => allocateCourier('zjbQXFXPAe8DxWjye3DO9qR6sUIM', 'Teste')}
          >
            {t('(Emulador) Alocar entregador Local')}
          </Button>
        )}
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
            couriersNotified.map((courier) => (
              <CourierNotifiedBox
                key={courier.id}
                order={order}
                isOrderActive={isOrderActive}
                courier={courier}
                dispatchingStatus={order?.dispatchingStatus}
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
          <LogsTable logs={matching?.logs ?? logs} />
        </Box>
      </Box>
    </>
  );
};
