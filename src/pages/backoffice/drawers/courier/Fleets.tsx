import { Box, Text } from '@chakra-ui/react';
import { Fleet } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';

interface FleetsProps {
  fleets?: Partial<Fleet>[];
}

const fakeFleets = [
  {
    name: 'Appjusto',
    description: 'Descrição da frota appjusto',
    participantsOnline: 10,
  },
];

export const Fleets = ({ fleets = fakeFleets }: FleetsProps) => {
  // state

  // UI
  return (
    <Box mt="4">
      {fleets &&
        fleets.map((fleet) => (
          <Box key={fleet.name} p="4" border="1px solid gray" borderRadius="lg">
            <Text color="black" fontSize="lg" lineHeight="26px">
              {fleet.name}
            </Text>
            <Text color="#4EA031" fontSize="sm" lineHeight="21px">
              {fleet.participantsOnline} {t('participantes')}
            </Text>
            <Text mt="2" fontSize="sm" lineHeight="21px">
              {fleet.description}
            </Text>
          </Box>
        ))}
    </Box>
  );
};
