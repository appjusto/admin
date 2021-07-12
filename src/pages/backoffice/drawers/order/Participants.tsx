import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { useOrderDeliveryInfos } from 'app/api/order/useOrderDeliveryInfos';
import { Order, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { Textarea } from 'common/components/form/input/Textarea';
import firebase from 'firebase/app';
import { DeliveryInfos } from 'pages/orders/drawers/orderdrawer/DeliveryInfos';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface ParticipantProps {
  name?: string;
  instruction?: string;
  address?: string;
  additionalInfo?: string;
  onboarding?: firebase.firestore.FieldValue;
  buttonLabel?: string;
  buttonLink?: string;
  isBtnDisabled?: boolean;
  removeCourier?(): void;
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
  removeCourier,
}: ParticipantProps) => {
  // state
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [comment, setComment] = React.useState('');
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
            {getDateAndHour(onboarding)}
          </Text>
        </Text>
      )}
      {buttonLabel && (
        <HStack mt="4" w="100%" spacing={4}>
          {isRemoving ? (
            <Flex
              w="100%"
              flexDir="column"
              justifyContent="center"
              bg="#FFF8F8"
              p="4"
              borderRadius="lg"
            >
              <Text>{'Informe o motivo da remoção:'}</Text>
              <Textarea mt="2" value={comment} onChange={(e) => setComment(e.target.value)} />
              <Flex mt="4" w="100%" justifyContent="space-between">
                <CustomButton
                  mt="0"
                  h="34px"
                  w="100%"
                  label={t('Manter')}
                  fontSize="xs"
                  lineHeight="lg"
                  onClick={() => setIsRemoving(false)}
                />
                <CustomButton
                  mt="0"
                  h="34px"
                  w="100%"
                  variant="danger"
                  label={t('Remover')}
                  fontSize="xs"
                  lineHeight="lg"
                  isDisabled={!comment}
                  onClick={removeCourier}
                />
              </Flex>
            </Flex>
          ) : (
            <>
              <CustomButton
                h="34px"
                mt="0"
                borderColor="#697667"
                variant="outline"
                label={buttonLabel}
                link={buttonLink}
                fontSize="xs"
                lineHeight="lg"
                isDisabled={isBtnDisabled}
              />
              {removeCourier && (
                <CustomButton
                  h="34px"
                  mt="0"
                  variant="dangerLight"
                  label={t('Remover entregador')}
                  fontSize="xs"
                  lineHeight="lg"
                  isDisabled={isBtnDisabled}
                  onClick={() => setIsRemoving(true)}
                />
              )}
            </>
          )}
        </HStack>
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
    //isMatched,
    //isCurrierArrived,
    isOrderActive,
    //orderDispatchingText,
    //arrivalTime,
  } = useOrderDeliveryInfos(order);
  // handlers
  const removeCourierFromOrder = () => {
    return console.log('remove');
  };

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
          />
          <SectionTitle>{t('Restaurante')}</SectionTitle>
          <Participant
            name={order?.business?.name ?? 'N/E'}
            address={order?.origin?.address?.main ?? 'N/E'}
            additionalInfo={order?.origin?.additionalInfo}
            buttonLabel={t('Ver cadastro do restaurante')}
            buttonLink={`/backoffice/businesses/${order?.business?.id}`}
          />
        </Box>
      ) : (
        <Box>
          <SectionTitle>{t('Cliente')}</SectionTitle>
          <Participant name={order?.consumer?.name ?? 'N/E'} />
          <SectionTitle>{t('Origem')}</SectionTitle>
          <Participant
            instruction={order?.origin?.intructions ?? 'N/E'}
            address={order?.origin?.address?.main ?? 'N/E'}
            additionalInfo={order?.origin?.additionalInfo}
          />
          <SectionTitle>{t('Destino')}</SectionTitle>
          <Participant
            instruction={order?.destination?.intructions ?? 'N/E'}
            address={order?.destination?.address?.main ?? 'N/E'}
            additionalInfo={order?.destination?.additionalInfo}
          />
        </Box>
      )}
      <SectionTitle>{t('Entregador')}</SectionTitle>
      <Participant
        name={order?.courier?.name ?? 'N/E'}
        buttonLabel={t('Ver cadastro do entregador')}
        buttonLink={`/backoffice/couriers/${order?.courier?.id}`}
        isBtnDisabled={!order?.courier}
        removeCourier={removeCourierFromOrder}
      />
      {isOrderActive ? (
        <DeliveryInfos order={order!} />
      ) : (
        <>
          <SectionTitle>{t('Destino do pedido')}</SectionTitle>
          <Text mt="1" fontSize="15px" lineHeight="21px">
            {order?.destination?.address.description ?? 'N/E'}
          </Text>
        </>
      )}
      {/*isOrderActive && (
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
            </Text>*/}
    </Box>
  );
};
