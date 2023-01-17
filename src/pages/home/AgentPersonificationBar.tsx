import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Link, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';

export const AgentPersonificationBar = () => {
  // context
  //const history = useHistory();
  const { business } = useContextBusiness();
  const { username } = useContextStaffProfile();
  // state
  const [dateTime, setDateTime] = React.useState('');

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  // UI
  return (
    <Flex
      position="fixed"
      top={{ base: '60px', lg: '0' }}
      w="100%"
      p="4"
      bg="gray.700"
      color="white"
      flexDir={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      zIndex="9999"
    >
      <Box>
        <HStack spacing={4}>
          <Link
            as={RouterLink}
            to={`/backoffice/businesses/${business?.id}`}
            w="48px"
            h="48px"
            bg="white"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="lg"
            //onClick={() => history.goBack()}
          >
            <ArrowBackIcon color="black" w="34px" h="34px" />
          </Link>
          <Box>
            <Text fontSize="20px" lineHeight="26px" fontWeight="700">
              {t(`Personificando ${business?.name}`)}
            </Text>
            <Text fontSize="15px" lineHeight="21px">
              {t('Agente: ')}
              <Text as="span" fontWeight="700">
                {username}
                {', '}
              </Text>
              <Text as="span" fontWeight="700">
                {dateTime}
              </Text>
            </Text>
          </Box>
        </HStack>
      </Box>
      <Box textAlign="end" display={{ base: 'none', md: 'initial' }}>
        <Text fontSize="20px" lineHeight="26px" fontWeight="700">
          {t('Atenção às modificações')}
        </Text>
        <Text fontSize="15px" lineHeight="21px">
          {t(
            'Os dados alterados podem impactar no funcionamento do restaurante'
          )}
        </Text>
      </Box>
    </Flex>
  );
};
