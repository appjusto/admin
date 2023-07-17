import { Business, BusinessService } from '@appjusto/types';
import { Box, Center, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextServerTime } from 'app/state/server-time';
import { useContextStaffProfile } from 'app/state/staff/context';
import { FilterText } from 'common/components/backoffice/FilterText';
import { getBusinessServiceActivationDate } from 'pages/insurance/utils';
import { OnboardingProps } from 'pages/onboarding/types';
import { isNewValidOnboardingStep } from 'pages/onboarding/utils';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { MdInfo } from 'react-icons/md';
import { Redirect } from 'react-router-dom';
import { getBusinessService, getServiceCreatedByEmail } from 'utils/functions';
import { t } from 'utils/i18n';
import { FleetPage } from './FleetPage';
import { LogisticsOptions } from './LogisticsOptions';

export type LogisticsType = 'appjusto' | 'private';

const LogisticsPage = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { user } = useContextFirebaseUser();
  const { isBackofficeUser } = useContextStaffProfile();
  const { getServerTime } = useContextServerTime();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, businessFleet, platformFees, logisticsAvailable } =
    useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isSuccess, isLoading } = updateResult;
  // state
  const [page, setPage] = React.useState<'logistics' | 'fleet'>('logistics');
  const [logisticsAccepted, setLogisticsAccepted] =
    React.useState<BusinessService | null>();
  const [logistics, setLogistics] = React.useState<LogisticsType>('appjusto');
  // helpers
  const isNewOnboardingStep = React.useMemo(
    () => isNewValidOnboardingStep(onboarding, business?.onboarding),
    [business?.onboarding, onboarding]
  );
  const showTabs = React.useMemo(
    () => !onboarding && !logisticsAccepted,
    [onboarding, logisticsAccepted]
  );
  const isFleetPending = React.useMemo(
    () => logisticsAccepted === null && businessFleet === null,
    [logisticsAccepted, businessFleet]
  );
  const showFleetPendingAlert = React.useMemo(
    () => !onboarding && isFleetPending && business?.situation === 'approved',
    [onboarding, isFleetPending, business?.situation]
  );
  const logisticsActivatedAt = React.useMemo(
    () => getBusinessServiceActivationDate(logisticsAccepted),
    [logisticsAccepted]
  );
  const createdByEmail = React.useMemo(
    () => getServiceCreatedByEmail(logisticsAccepted),
    [logisticsAccepted]
  );
  // handlers
  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.uid) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'business-fleet-submit-error',
        message: {
          title: 'Não foi possível encontrar as informações do usuário.',
        },
      });
      return;
    }
    if (!business?.id) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'business-fleet-submit-error',
        message: {
          title: 'Não foi possível encontrar as informações do restaurante.',
        },
      });
      return;
    }
    if (isBackofficeUser)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'logistics-page-error',
        message: {
          title:
            'Apenas donos e gerentes de restaurantes podem ativar ou desativar a entrega AppJusto.',
        },
      });
    try {
      if (logistics === 'appjusto') {
        if (!platformFees?.logistics) {
          dispatchAppRequestResult({
            status: 'error',
            requestId: 'business-fleet-submit-error',
            message: {
              title:
                'Os parâmetros da plataforma, para logística, não foram encontrados.',
            },
          });
          return;
        }
        // save logistics service in business document
        const time = getServerTime().getTime();
        const logisticsService = {
          name: 'logistics',
          fee: platformFees.logistics,
          createdBy: {
            id: user.uid,
            email: user.email,
          },
          createdOn: time,
        } as BusinessService;
        const services = business?.services ?? [];
        services.push(logisticsService);
        updateBusinessProfile({ services });
      } else {
        // removing logistics from business services
        const services =
          business?.services?.filter(
            (service) => service.name !== 'logistics'
          ) ?? [];
        const changes = {
          services,
        } as Partial<Business>;
        updateBusinessProfile(changes);
      }
    } catch (error) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'business-fleet-submit-error',
        message: { title: 'Não foi possível salvar as informações.' },
      });
    }
  };
  // to handle with useEffect dependencies bug
  const servivesLength = business?.services
    ? business.services.length
    : undefined;
  // side effects
  React.useEffect(() => {
    window?.scrollTo(0, 0);
  }, []);
  React.useEffect(() => {
    if (!updateResult.isSuccess) return;
    window?.scrollTo(0, 0);
  }, [updateResult.isSuccess]);
  React.useEffect(() => {
    if (isNewOnboardingStep) {
      if (logisticsAvailable === 'none') {
        setLogistics('private');
      } else {
        setLogistics('appjusto');
      }
    } else {
      const logisticsService = getBusinessService(
        business?.services,
        'logistics'
      );
      if (logisticsService) {
        setLogistics('appjusto');
        setLogisticsAccepted(logisticsService);
      } else {
        setLogisticsAccepted(null);
        setLogistics('private');
      }
    }
  }, [
    isNewOnboardingStep,
    logisticsAvailable,
    servivesLength,
    business?.services,
  ]);
  React.useEffect(() => {
    if (onboarding) return;
    if (business?.situation === 'approved') return;
    if (!isFleetPending) return;
    setPage('fleet');
  }, [onboarding, business?.situation, isFleetPending]);
  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box>
      <PageHeader
        title={t('Entrega')}
        subtitle={t(
          'Defina como será a logística de entrega do seu restaurante.'
        )}
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
      {logisticsAccepted && logisticsActivatedAt && (
        <Flex
          mt="4"
          p="4"
          flexDir="row"
          border="1px solid #C8D7CB"
          borderRadius="lg"
          maxW="468px"
        >
          <Center>
            <Icon as={MdInfo} w="24px" h="24px" />
          </Center>
          <Box ml="4">
            <Text fontWeight="700">
              {t(`Entrega AppJusto ativada em ${logisticsActivatedAt}`)}
            </Text>
            {createdByEmail && (
              <Text fontSize="14px" fontWeight="700">
                {t('Solicitada por: ')}
                <Text as="span" fontWeight="500">
                  {createdByEmail}
                </Text>
              </Text>
            )}
          </Box>
        </Flex>
      )}
      {showTabs && (
        <Box mt="2">
          <Flex
            mt="8"
            mb="4"
            w="100%"
            justifyContent="space-between"
            borderBottom="1px solid #C8D7CB"
          >
            <HStack spacing={4}>
              <FilterText
                isActive={page === 'logistics'}
                label={t('Escolha o tipo de entrega')}
                onClick={() => setPage('logistics')}
              />
              <FilterText
                isActive={page === 'fleet'}
                label={t('Configure sua entrega')}
                onClick={() => setPage('fleet')}
                isAlert={isFleetPending}
              />
            </HStack>
          </Flex>
        </Box>
      )}
      {page === 'logistics' ? (
        <form onSubmit={onSubmitHandler}>
          <LogisticsOptions
            logistics={logistics}
            logisticsAccepted={logisticsAccepted}
            handleChange={setLogistics}
          />
          <Box
            mt="4"
            px="4"
            py="2"
            w="fit-content"
            minW={{ lg: '346px' }}
            bgColor="#F5F5F5"
            borderRadius="lg"
          >
            <Text>
              {t('Gateway de pagamento: ')}
              <Text as="span" fontWeight="700">
                {t('PIX 0,99% , Crédito 2,42% + R$ 0,09')}
              </Text>
            </Text>
          </Box>
          <PageFooter
            onboarding={onboarding}
            requiredLabel={false}
            redirect={redirect}
            isLoading={isLoading}
          />
        </form>
      ) : (
        <FleetPage />
      )}
    </Box>
  );
};

export default LogisticsPage;
