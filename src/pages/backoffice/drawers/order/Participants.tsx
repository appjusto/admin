import { Box, Text } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { DeliveryMap } from 'pages/orders/drawers/orderdrawer/DeliveryMap';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface ParticipantProps {
  name: string;
  address?: string;
  onboarding: string;
  buttonLabel?: string;
  buttonLink?: string;
}

const Participant = ({ name, address, onboarding, buttonLabel, buttonLink }: ParticipantProps) => {
  const date = onboarding;
  return (
    <Box mb="10">
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Nome:')}{' '}
        <Text as="span" fontWeight="500">
          {name}
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
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Data do onboarding:')}{' '}
        <Text as="span" fontWeight="500">
          {date}
        </Text>
      </Text>
      {buttonLabel && (
        <CustomButton
          h="34px"
          borderColor="#697667"
          variant="outline"
          label={buttonLabel}
          link={buttonLink}
          fontSize="xs"
          lineHeight="lg"
        />
      )}
    </Box>
  );
};

interface ParticipantsProps {
  order?: WithId<Order> | null;
}

export const Participants = ({ order }: ParticipantsProps) => {
  return (
    <>
      <SectionTitle>{t('Cliente')}</SectionTitle>
      <Participant name="Nome do cliente" address="Endereço do cliente" onboarding="00/00/0000" />
      <SectionTitle>{t('Restaurante')}</SectionTitle>
      <Participant
        name="Nome do restaurante"
        address="Endereço do restaurante"
        onboarding="00/00/0000"
        buttonLabel="Ver cadastro do restaurante"
        buttonLink="/"
      />
      <SectionTitle>{t('Entregador')}</SectionTitle>
      <Participant
        name="Nome do entregador"
        onboarding="00/00/0000"
        buttonLabel="Ver cadastro do restaurante"
        buttonLink="/"
      />
      <SectionTitle>{t('Entregador à caminho da retirada')}</SectionTitle>
      <Text mt="1" fontSize="15px" lineHeight="21px">
        {t('Chega em aproximadamente 10 minutos')}
      </Text>
      <DeliveryMap order={order} />
    </>
  );
};
