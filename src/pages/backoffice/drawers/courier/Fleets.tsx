import { Box, Text } from '@chakra-ui/react';
import { useContextCourierProfile } from 'app/state/courier/context';
import React from 'react';

export const Fleets = () => {
  // context
  const { courier } = useContextCourierProfile();
  const fleets = courier?.fleet ? [{ ...courier?.fleet }] : [];
  // UI
  return (
    <Box mt="4">
      {fleets &&
        fleets.map((fleet) => (
          <Box key={fleet.name} p="4" border="1px solid #C8D7CB" borderRadius="lg">
            <Text color="black" fontSize="lg" lineHeight="26px">
              {fleet.name}
            </Text>
            {/* <Text color="#4EA031" fontSize="sm" lineHeight="21px">
              {fleet.participantsOnline} {t('participantes')}
            </Text> */}
            <Text mt="2" fontSize="sm" lineHeight="21px">
              {fleet.description}
            </Text>
          </Box>
        ))}
    </Box>
  );
};
