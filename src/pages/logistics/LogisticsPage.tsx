import { Business, BusinessService } from '@appjusto/types';
import { Box, Checkbox, Flex, Link, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextServerTime } from 'app/state/server-time';
import { useContextStaffProfile } from 'app/state/staff/context';
import { OnboardingProps } from 'pages/onboarding/types';
import { isNewValidOnboardingStep } from 'pages/onboarding/utils';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { getBusinessService } from 'utils/functions';
import { t } from 'utils/i18n';
import { LogisticsOptions } from './LogisticsOptions';

export type LogisticsType = 'appjusto' | 'private';

const LogisticsPage = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { user } = useContextFirebaseUser();
  const { isBackofficeUser } = useContextStaffProfile();
  const { getServerTime } = useContextServerTime();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, platformFees, logisticsAvailable } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isSuccess, isLoading } = updateResult;
  // state
  const [logistics, setLogistics] = React.useState<LogisticsType>('appjusto');
  const [isAgreed, setIsAgreed] = React.useState(false);
  // helpers
  const isNewOnboardingStep = React.useMemo(
    () => isNewValidOnboardingStep(onboarding, business?.onboarding),
    [business?.onboarding, onboarding]
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
            'Apenas donos e gerentes de restaurantes podem ativar ou desativar a entrega appjusto.',
        },
      });
    if (!isAgreed)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'logistics-page-agreed',
        message: {
          title:
            'Para continuar, você deve concordar com os termos do plano selecionado.',
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
      } else {
        setLogistics('private');
      }
    }
  }, [
    isNewOnboardingStep,
    logisticsAvailable,
    servivesLength,
    business?.services,
  ]);
  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box>
      <PageHeader
        title={t('Plano de contratação')}
        subtitle={t('Escolha o plano do seu restaurante.')}
      />
      <form onSubmit={onSubmitHandler}>
        <LogisticsOptions logistics={logistics} handleChange={setLogistics} />
        <Flex
          mt="4"
          px="4"
          py="2"
          maxW="fit-content"
          bgColor="#F5F5F5"
          borderRadius="lg"
        >
          <Checkbox
            size="sm"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          >
            <Text>
              {t('Li e estou de acordo com os ')}
              <Link
                href="https://github.com/appjusto/docs/blob/main/legal/termos-de-uso-restaurantes.md"
                target="_blank"
                fontWeight="700"
                textDecor="underline"
              >
                {t('termos do plano selecionado')}
              </Link>
            </Text>
          </Checkbox>
        </Flex>
        <PageFooter
          onboarding={onboarding}
          requiredLabel={false}
          redirect={redirect}
          isLoading={isLoading}
        />
      </form>
    </Box>
  );
};

export default LogisticsPage;
