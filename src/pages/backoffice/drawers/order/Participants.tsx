import { Issue, IssueType, Order, WithId } from '@appjusto/types';
import { Box, Text } from '@chakra-ui/react';
import { useOrderCourierRemoval } from 'app/api/order/useOrderCourierRemoval';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { useContextAppRequests } from 'app/state/requests/context';
import { isLogisticsIncluded } from 'pages/logistics/utils';
import { DeliveryInfos } from 'pages/orders/drawers/orderdrawer/DeliveryInfos';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { Participant } from './Participant';
interface ParticipantsProps {
  order?: WithId<Order> | null;
  businessInsurance?: boolean;
}

const activeOrderStatuses = ['confirmed', 'preparing', 'ready', 'dispatching'];
const dropsFoodIssues = ['courier-drops-food-delivery'] as IssueType[];
const dropsP2pIssues = ['courier-drops-p2p-delivery'] as IssueType[];

export const Participants = ({
  order,
  businessInsurance,
}: ParticipantsProps) => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const issues = useIssuesByType(
    order?.type === 'food' ? dropsFoodIssues : dropsP2pIssues
  );
  const { courierManualRemoval, removalResult } = useOrderCourierRemoval();
  // helpers
  const isOrderActive = React.useMemo(
    () => (order?.status ? activeOrderStatuses.includes(order?.status) : false),
    [order?.status]
  );
  const logisticsIncluded = React.useMemo(
    () => isLogisticsIncluded(order?.fare?.courier?.payee),
    [order?.fare?.courier?.payee]
  );
  const showDispatchingInfos = React.useMemo(
    () => order?.fulfillment === 'delivery' && logisticsIncluded,
    [order?.fulfillment, logisticsIncluded]
  );
  // handlers
  const removeCourierFromOrder = (issue?: WithId<Issue>, comment?: string) => {
    if (!order?.id || !order?.courier?.id)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'Participants-valid',
      });
    if (!issue)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'Participants-valid-no-issue',
        message: {
          title: 'Informações incompletas',
          description: 'É preciso irformar o motivo da remoção.',
        },
      });
    courierManualRemoval({ orderId: order.id, issue, comment });
  };
  // UI
  return (
    <Box>
      {order?.type === 'food' ? (
        <Box>
          <SectionTitle>{t('Restaurante')}</SectionTitle>
          <Participant
            type="business"
            participantId={order.business?.id}
            name={order?.business?.name}
            address={order?.origin?.address?.description}
            additionalInfo={order?.origin?.additionalInfo}
            businessInsurance={businessInsurance}
          />
          <SectionTitle>{t('Cliente')}</SectionTitle>
          <Participant
            type="consumer"
            participantId={order?.consumer?.id}
            name={order?.consumer?.name}
            address={order?.destination?.address?.description}
            additionalInfo={order?.destination?.additionalInfo}
            coordinates={order?.consumer.coordinates}
          />
        </Box>
      ) : (
        <Box>
          <SectionTitle>{t('Cliente')}</SectionTitle>
          <Participant
            type="consumer"
            participantId={order?.consumer?.id}
            name={order?.consumer?.name ?? 'N/E'}
            coordinates={order?.consumer.coordinates}
          />
          <SectionTitle>{t('Origem')}</SectionTitle>
          <Participant
            type="p2p-instructions"
            instruction={order?.origin?.intructions}
            address={order?.origin?.address?.description}
            additionalInfo={order?.origin?.additionalInfo}
          />
          <SectionTitle>{t('Destino')}</SectionTitle>
          <Participant
            type="p2p-instructions"
            instruction={order?.destination?.intructions}
            address={order?.destination?.address?.description}
            additionalInfo={order?.destination?.additionalInfo}
          />
        </Box>
      )}
      {showDispatchingInfos && (
        <>
          <SectionTitle>{t('Entregador')}</SectionTitle>
          <Participant
            type="courier"
            participantId={order?.courier?.id}
            isOutsource={order?.dispatchingStatus === 'outsourced'}
            isOrderActive={isOrderActive}
            name={order?.courier?.name}
            phone={order?.courier?.phone}
            mode={order?.courier?.mode}
            deliveries={order?.courier?.statistics?.deliveries}
            rejected={order?.courier?.statistics?.rejected}
            dropIssues={issues}
            removeCourier={removeCourierFromOrder}
            isLoading={removalResult.isLoading}
          />
          <SectionTitle>{t('Frota')}</SectionTitle>
          <Text
            mt="2"
            mb="10"
            fontSize="15px"
            color="black"
            fontWeight="700"
            lineHeight="22px"
          >
            {t('Nome:')}{' '}
            <Text as="span" fontWeight="500">
              {order?.fare?.fleet?.name ?? 'N/E'}
            </Text>
          </Text>
        </>
      )}
      {showDispatchingInfos && (
        <>
          {isOrderActive ? (
            <DeliveryInfos order={order!} isBackofficeDrawer />
          ) : (
            <>
              <SectionTitle>{t('Destino do pedido')}</SectionTitle>
              <Text mt="1" fontSize="15px" lineHeight="21px">
                {order?.destination?.address.description ?? 'N/E'}
              </Text>
            </>
          )}
        </>
      )}
    </Box>
  );
};
