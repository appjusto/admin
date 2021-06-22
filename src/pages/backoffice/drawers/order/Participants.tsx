import { Box, Text } from '@chakra-ui/react';
import { useOrderDeliveryInfos } from 'app/api/order/useOrderDeliveryInfos';
import { Order, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import firebase from 'firebase';
import { DeliveryMap } from 'pages/orders/drawers/orderdrawer/DeliveryMap';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface ParticipantProps {
  name?: string;
  instruction?: string;
  address?: string;
  additionalInfo?: string;
  onboarding?: firebase.firestore.Timestamp;
  buttonLabel?: string;
  buttonLink?: string;
  isBtnDisabled?: boolean;
}

const Participant = ({
  name,
  instruction,
  address,
  additionalInfo,
  onboarding,
  buttonLabel,
  buttonLink,
  isBtnDisabled = false,
}: ParticipantProps) => {
  // helpers
  const date = onboarding ? getDateAndHour(onboarding) : 'N/E';

  // UI
  return (
    <Box mb="10">
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {name ? t('Nome:') : t('Instrução:')}{' '}
        <Text as="span" fontWeight="500">
          {name ?? instruction}
        </Text>
      </Text>
      {address && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Endereço principal:')}{' '}
          <Text as="span" fontWeight="500">
            {address}
          </Text>
        </Text>
      )}
      {additionalInfo && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Complemento:')}{' '}
          <Text as="span" fontWeight="500">
            {additionalInfo}
          </Text>
        </Text>
      )}
      {onboarding && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Data do onboarding:')}{' '}
          <Text as="span" fontWeight="500">
            {date}
          </Text>
        </Text>
      )}
      {buttonLabel && (
        <CustomButton
          h="34px"
          borderColor="#697667"
          variant="outline"
          label={buttonLabel}
          link={buttonLink}
          fontSize="xs"
          lineHeight="lg"
          isDisabled={isBtnDisabled}
        />
      )}
    </Box>
  );
};

interface ParticipantsProps {
  order?: WithId<Order> | null;
}

export const Participants = ({ order }: ParticipantsProps) => {
  // helpers
  const {
    isMatched,
    isCurrierArrived,
    isOrderActive,
    orderDispatchingText,
    arrivalTime,
  } = useOrderDeliveryInfos(order);

  // UI
  return (
    <Box>
      {order?.type === 'food' ? (
        <Box>
          <SectionTitle>{t('Cliente')}</SectionTitle>
          <Participant
            name={order?.consumer?.name ?? 'N/E'}
            address={order?.destination?.address?.main ?? 'N/E'}
            additionalInfo={order?.destination?.additionalInfo}
            //onboarding={order?.createdOn as firebase.firestore.Timestamp} low-priority
          />
          <SectionTitle>{t('Restaurante')}</SectionTitle>
          <Participant
            name={order?.business?.name ?? 'N/E'}
            address={order?.origin?.address?.main ?? 'N/E'}
            additionalInfo={order?.origin?.additionalInfo}
            //onboarding={order?.createdOn as firebase.firestore.Timestamp} low-priority
            buttonLabel={t('Ver cadastro do restaurante')}
            buttonLink={`/backoffice/businesses/${order?.business?.id}`}
          />
        </Box>
      ) : (
        <Box>
          <SectionTitle>{t('Cliente')}</SectionTitle>
          <Participant
            name={order?.consumer?.name ?? 'N/E'}
            //onboarding={order?.createdOn as firebase.firestore.Timestamp} low-priority
          />
          <SectionTitle>{t('Origem')}</SectionTitle>
          <Participant
            instruction={order?.origin?.intructions ?? 'N/E'}
            address={order?.origin?.address?.main ?? 'N/E'}
            additionalInfo={order?.origin?.additionalInfo}
            //onboarding={order?.createdOn as firebase.firestore.Timestamp} low-priority
          />
          <SectionTitle>{t('Destino')}</SectionTitle>
          <Participant
            instruction={order?.destination?.intructions ?? 'N/E'}
            address={order?.destination?.address?.main ?? 'N/E'}
            additionalInfo={order?.destination?.additionalInfo}
            //onboarding={order?.createdOn as firebase.firestore.Timestamp} low-priority
          />
        </Box>
      )}
      <SectionTitle>{t('Entregador')}</SectionTitle>
      <Participant
        name={order?.courier?.name ?? 'N/E'}
        //onboarding={order?.createdOn as firebase.firestore.Timestamp} low-priority
        buttonLabel={t('Ver cadastro do entregador')}
        buttonLink={`/backoffice/couriers/${order?.courier?.id}`}
        isBtnDisabled={!order?.courier}
      />
      {isOrderActive && (
        <>
          <SectionTitle>{orderDispatchingText}</SectionTitle>
          {isMatched &&
            !isCurrierArrived &&
            (arrivalTime && arrivalTime > 0 ? (
              <Text mt="1" fontSize="15px" lineHeight="21px">
                {t(
                  `Chega em aproximadamente ${
                    arrivalTime > 1 ? arrivalTime + ' minutos' : arrivalTime + ' minuto'
                  }`
                )}
              </Text>
            ) : (
              <Text mt="1" fontSize="15px" lineHeight="21px">
                {t(`Chega em menos de 1 minuto`)}
              </Text>
            ))}
          <DeliveryMap
            orderStatus={order?.status}
            origin={order?.origin?.location}
            destination={order?.destination?.location}
            courier={order?.courier?.location}
            orderPolyline={order?.route?.polyline}
          />
        </>
      )}
      <SectionTitle>{t('Destino do pedido')}</SectionTitle>
      <Text mt="1" fontSize="15px" lineHeight="21px">
        {order?.destination?.address.description ?? 'N/E'}
      </Text>
    </Box>
  );
};
