import { Order, OrderStatus, WithId } from '@appjusto/types';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useGetOutsourceDelivery } from 'app/api/order/useGetOutsourceDelivery';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';

interface OutsourcedProps {
  order?: WithId<Order> | null;
  canOutsource?: boolean;
  updateOrderStatus(status: OrderStatus): void;
  isLoading: boolean;
}

export const Outsourced = ({
  order,
  canOutsource,
  updateOrderStatus,
  isLoading,
}: OutsourcedProps) => {
  // context
  const {
    getOutsourceDelivery,
    outsourceDeliveryResult,
    updateOutsourcingCourierInfos,
    updateOutsourcingCourierInfosResult,
  } = useGetOutsourceDelivery(order?.id);
  // state
  const [outsourcingCourierName, setOutsourcingCourierName] =
    React.useState<string>();
  // helpers
  const isOrderFlagged = order?.flags?.includes('matching');
  const deliveryFare = order?.fare?.courier?.value
    ? formatCurrency(order.fare.courier.value)
    : 'N/E';
  const isOrderActive =
    order?.status &&
    ['preparing', 'ready', 'dispatching'].includes(order?.status);
  const isCourierFromNet = typeof order?.courier?.id === 'string';
  // side effects
  React.useEffect(() => {
    if (!order?.courier?.name) return;
    setOutsourcingCourierName(order?.courier?.name);
  }, [order?.courier?.name]);
  // UI
  if (isOrderActive && order?.dispatchingStatus === 'outsourced') {
    return (
      <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" p="4">
        <SectionTitle mt="0">
          {t('Logística fora da rede AppJusto')}
        </SectionTitle>
        {order.outsourcedBy === 'business' ? (
          <>
            <Text mt="2">
              {t(
                `Não foi possível encontrar entregadores disponíveis na nossa rede e você optou por assumir a logística, recebendo o repasse do valor do frete (${deliveryFare}).`
              )}
            </Text>
            <HStack mt="4">
              <CustomInput
                mt="0"
                id="out-courier-name"
                label={t('Informe o nome do entregador')}
                value={outsourcingCourierName ?? ''}
                onChange={(ev) => setOutsourcingCourierName(ev.target.value)}
              />
              <Button
                h="60px"
                onClick={() =>
                  updateOutsourcingCourierInfos({
                    name: outsourcingCourierName!,
                  })
                }
                isLoading={updateOutsourcingCourierInfosResult.isLoading}
                isDisabled={!outsourcingCourierName}
              >
                {t('Salvar')}
              </Button>
            </HStack>
            <Text mt="6">
              {t(`Após a realização da entrega, confirme com o botão abaixo:`)}
            </Text>
            <Button
              mt="4"
              onClick={() => updateOrderStatus('delivered')}
              isLoading={isLoading}
              isDisabled={order.status !== 'dispatching'}
            >
              {t('Confirmar que o pedido foi entregue ao cliente')}
            </Button>
          </>
        ) : (
          <>
            <Text mt="2">
              {t(
                'Não foi possível encontrar entregadores disponíveis na nossa rede. Um entregador de outra rede fará a retirada. A equipe AppJusto está monitorando o pedido e concluirá o mesmo após a realização da entrega.'
              )}
            </Text>
            <Text mt="4">
              {t('Nome do entregador: ')}
              <Text as="span" fontWeight="700">
                {order.courier?.name ?? 'Buscando'}
              </Text>
            </Text>
          </>
        )}
      </Box>
    );
  }
  if (isOrderActive && !isCourierFromNet && canOutsource && isOrderFlagged) {
    return (
      <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" p="4">
        <SectionTitle mt="0">{t('Você pode assumir a logística')}</SectionTitle>
        <Text mt="2">
          {t(
            `Ao assumir a logística, iremos repassar o valor de ${deliveryFare} pelo custo da entrega, além do valor do pedido que já foi cobrado do cliente. Caso confirme, o AppJusto não terá como monitorar a entrega.`
          )}
        </Text>
        <HStack mt="4">
          {/* <Button mt="0" variant="dangerLight" onClick={cancel}>
            {t('Cancelar')}
          </Button> */}
          <Button
            mt="0"
            onClick={() => getOutsourceDelivery({ accountType: 'business' })}
            isLoading={outsourceDeliveryResult.isLoading}
          >
            {t('Confirmar')}
          </Button>
        </HStack>
      </Box>
    );
  }
  return <Box />;
};
