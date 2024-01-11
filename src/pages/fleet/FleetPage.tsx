import { Box, Center, Flex, Icon, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { MdInfo } from 'react-icons/md';
import { getBusinessService } from 'utils/functions';
import { t } from 'utils/i18n';
import { FleetForm } from './FleetForm';

const FleetPage = () => {
  const { business, businessFleet } = useContextBusiness();

  const isFleetPending = React.useMemo(() => {
    const logisticsService = getBusinessService(
      business?.services,
      'logistics'
    );
    return !logisticsService && businessFleet === null;
  }, [business?.services, businessFleet]);

  const showFleetPendingAlert =
    isFleetPending && business?.situation === 'approved';

  return (
    <Box>
      <PageHeader
        title={t('Configure sua entrega')}
        subtitle={t('Defina os parâmetros da sua entrega própria.')}
      />
      {showFleetPendingAlert && (
        <Flex
          mt="4"
          p="4"
          flexDir="row"
          border="1px solid #C8D7CB"
          borderRadius="lg"
          bgColor="yellow"
          maxW="468px"
        >
          <Center>
            <Icon as={MdInfo} w="24px" h="24px" />
          </Center>
          <Box ml="4">
            <Text fontWeight="700">
              {t('Sua entrega própria ainda não está ativa')}
            </Text>
            <Text fontSize="13px">
              {t(
                'Para ativa-la é preciso configurar a sua entrega, na aba abaixo. Enquando isso, seus pedidos continuarão com a '
              )}
              <Text as="span" fontWeight="700">
                {t('entrega AppJusto.')}
              </Text>
            </Text>
          </Box>
        </Flex>
      )}
      <FleetForm />
    </Box>
  );
};

export default FleetPage;
