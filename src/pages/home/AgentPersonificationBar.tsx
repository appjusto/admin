import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Link, Text } from '@chakra-ui/react';
import { useContextAgentProfile } from 'app/state/agent/context';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';

export const AgentPersonificationBar = () => {
  // context
  const agent = useContextAgentProfile();
  // state
  const [dateTime, setDateTime] = React.useState('');

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  // UI
  const username = agent?.email ? agent?.email.split('@')[0] : '';
  return (
    <Flex
      position="fixed"
      top="0"
      w="100%"
      p="4"
      bg="gray.700"
      color="white"
      justifyContent="space-between"
      zIndex="999"
    >
      <Box>
        <HStack spacing={4}>
          <Link
            as={RouterLink}
            to="/backoffice"
            w="48px"
            h="48px"
            bg="white"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="lg"
          >
            <ArrowBackIcon color="black" w="34px" h="34px" />
          </Link>
          <Box>
            <Text fontSize="20px" lineHeight="26px" fontWeight="700">
              {t('Personificando restaurante')}
            </Text>
            <Text fontSize="15px" lineHeight="21px">
              {t('Personificado por')}{' '}
              <Text as="span" fontWeight="700">
                {username}
              </Text>
              {t(' em')}{' '}
              <Text as="span" fontWeight="700">
                {dateTime}
              </Text>
            </Text>
          </Box>
        </HStack>
      </Box>
      <Box textAlign="end">
        <Text fontSize="20px" lineHeight="26px" fontWeight="700">
          {t('Atenção as modificações')}
        </Text>
        <Text fontSize="15px" lineHeight="21px">
          {t('Os dados alterados podem impactar no funcionamento do restaurante')}
        </Text>
      </Box>
    </Flex>
  );
};
