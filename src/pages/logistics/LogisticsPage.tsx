import { Business, BusinessService } from '@appjusto/types';
import { Box, Flex, HStack } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextServerTime } from 'app/state/server-time';
import { FilterText } from 'common/components/backoffice/FilterText';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import { FleetPage } from './FleetPage';
import { LogisticsOptions } from './LogisticsOptions';

export type LogisticsType = 'appjusto' | 'private';

const LogisticsPage = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { user } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, businessFleet, platformFees } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isSuccess, isLoading } = updateResult;
  // state
  const [page, setPage] = React.useState<'logistics' | 'fleet'>('logistics');
  const [logisticsAccepted, setLogisticsAccepted] =
    React.useState<BusinessService>();
  const [logistics, setLogistics] = React.useState<LogisticsType>('appjusto');
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
    if (onboarding) {
      window?.scrollTo(0, 0);
    }
  }, [onboarding]);
  React.useEffect(() => {
    if (!business?.services) return;
    const logisticsService = business.services?.find(
      (service) => service.name === 'logistics'
    );
    if (logisticsService) {
      setLogistics('appjusto');
      setLogisticsAccepted(logisticsService);
    } else {
      setLogisticsAccepted(undefined);
      setLogistics('private');
    }
  }, [servivesLength, business?.services]);
  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box>
      <PageHeader
        title={t('Logística')}
        subtitle={t(
          'Defina como será a logística de entrega do seu restaurante.'
        )}
      />
      {!onboarding && !logisticsAccepted && (
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
                label={t('Escolha a Logística')}
                onClick={() => setPage('logistics')}
              />
              <FilterText
                isActive={page === 'fleet'}
                label={t('Configure sua frota')}
                onClick={() => setPage('fleet')}
                isAlert={logistics === 'private' && !businessFleet}
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
