import { Fleet } from '@appjusto/types';
import { Box, Text } from '@chakra-ui/react';
import { useGetFleetById } from 'app/api/fleet/useGetFleetById';
import { useContextCourierProfile } from 'app/state/courier/context';
import React from 'react';
import { t } from 'utils/i18n';

export const Fleets = () => {
  // context
  const { courier } = useContextCourierProfile();
  const fleetId = courier?.fleetsIds ? courier?.fleetsIds[0] : undefined;
  const fleet = useGetFleetById(fleetId);
  // state
  const [fleets, setFleets] = React.useState<Fleet[]>([]);
  // side effects
  React.useEffect(() => {
    if (fleet) setFleets([fleet]);
  }, [fleet]);
  // UI
  return (
    <Box mt="4">
      {fleets &&
        fleets.map((fleet) => (
          <Box
            key={fleet.name}
            p="4"
            border="1px solid #C8D7CB"
            borderRadius="lg"
          >
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
