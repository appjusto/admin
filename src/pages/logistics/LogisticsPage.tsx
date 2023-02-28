import { BusinessService } from '@appjusto/types';
import {
  Box,
  Flex,
  Icon,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextServerTime } from 'app/state/server-time';
import { ReactComponent as motocycleGray } from 'common/img/motocycle-gray.svg';
import { ReactComponent as motocycleGreen } from 'common/img/motocycle-green.svg';
import { ReactComponent as motocycleYellow } from 'common/img/motocycle-yellow.svg';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import { CommissionItem } from './CommissionItem';
import { LogisticsBox } from './LogisticsBox';
import { LogisticsItem } from './LogisticsItem';

type Logistic = 'logistics' | 'logistics-by-partners' | 'own-logistics';

const LogisticsPage = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { user } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, insuranceAvailable } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isLoading, isSuccess } = updateResult;
  // state
  const [logisticsAccepted, setLogisticsAccepted] =
    React.useState<BusinessService>();
  const [logistics, setLogistics] = React.useState<Logistic>();
  // helpers

  // handlers
  const onSubmitHandler = (event: any) => {
    event.preventDefault();
    if (!user?.uid || !user?.email)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: {
          title: 'Não foi possível acessar as credenciais do usuário.',
        },
      });
    try {
      const time = getServerTime().getTime();
      const newInsurance = {
        ...insuranceAvailable,
        createdBy: {
          id: user.uid,
          email: user.email,
        },
        createdOn: time,
      } as BusinessService;
      const services = business?.services ?? [];
      services.push(newInsurance);
      updateBusinessProfile({ services });
    } catch (error) {
      console.log(error);
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: { title: 'Não foi possível acessar o servidor.' },
      });
    }
  };
  // side effects
  React.useEffect(() => {
    if (onboarding) {
      window?.scrollTo(0, 0);
    }
  }, [onboarding]);

  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box maxW="756px">
      <form onSubmit={onSubmitHandler}>
        <PageHeader
          title={t('Logística')}
          subtitle={t(
            'Defina como será a logística de entrega do seu restaurante.'
          )}
        />
        <RadioGroup
          mt="4"
          value={logistics}
          onChange={(value) => setLogistics(value as Logistic)}
        >
          <VStack spacing={4} alignItems="flex-start">
            <LogisticsBox isSelected={logistics === 'logistics'}>
              <Flex>
                <Radio value="logistics">
                  <Text ml="2" fontSize="18px" fontWeight="700">
                    {t('Logística AppJusto')}
                  </Text>
                </Radio>
                <Icon as={motocycleGreen} ml="6" w="48px" h="48px" />
              </Flex>
              <LogisticsItem title={t('Com Logística AppJusto')} icon>
                <Text>
                  {t('A entrega é feita por ')}
                  <Text as="span" fontWeight="700">
                    {t('nossa rede entregadores e por parceiros')}
                  </Text>
                </Text>
              </LogisticsItem>
              <LogisticsItem title={t('Sem Mensalidades')} icon>
                <Text>
                  {t('Uma vantagem do AppJusto é que ')}
                  <Text as="span" fontWeight="700">
                    {t('não cobramos mensalidade')}
                  </Text>
                </Text>
              </LogisticsItem>
              <CommissionItem fee="5%" highlight />
            </LogisticsBox>
            <LogisticsBox isSelected={logistics === 'logistics-by-partners'}>
              <Flex>
                <Radio value="logistics-by-partners">
                  <Text ml="2" fontSize="18px" fontWeight="700">
                    {t('Logística por Parceiros')}
                  </Text>
                </Radio>
                <Icon as={motocycleYellow} ml="6" w="48px" h="48px" />
              </Flex>
              <LogisticsItem title={t('Com Logística por Parceiros')} icon>
                <Text>
                  {t(
                    'O AppJusto ainda está construindo a rede de entregadores na sua cidade. Até lá '
                  )}
                  <Text as="span" fontWeight="700">
                    {t('suas entregas serão feitas por empresas parceiras')}
                  </Text>
                </Text>
              </LogisticsItem>
              <LogisticsItem title={t('Sem Mensalidades')} icon>
                <Text>
                  {t('Uma vantagem do AppJusto é que ')}
                  <Text as="span" fontWeight="700">
                    {t('não cobramos mensalidade')}
                  </Text>
                </Text>
              </LogisticsItem>
              <CommissionItem fee="5%" highlight />
            </LogisticsBox>
            <LogisticsBox isSelected={logistics === 'own-logistics'}>
              <Flex>
                <Radio value="own-logistics">
                  <Text ml="2" fontSize="18px" fontWeight="700">
                    {t('Logística Própria')}
                  </Text>
                </Radio>
                <Icon as={motocycleGray} ml="6" w="48px" h="48px" />
              </Flex>
              <LogisticsItem title={t('Sem Logística AppJusto')}>
                <Text>
                  {t('A entrega é feita por ')}
                  <Text as="span" fontWeight="700">
                    {t('sua rede de entregadores')}
                  </Text>
                </Text>
              </LogisticsItem>
              <LogisticsItem title={t('Sem Mensalidades')} icon>
                <Text>
                  {t('Uma vantagem do AppJusto é que ')}
                  <Text as="span" fontWeight="700">
                    {t('não cobramos mensalidade')}
                  </Text>
                </Text>
              </LogisticsItem>
              <CommissionItem fee="3%" />
            </LogisticsBox>
          </VStack>
        </RadioGroup>
        <PageFooter
          onboarding={onboarding}
          requiredLabel={false}
          redirect={redirect}
          isLoading={isLoading}
          // isDisabled={getActionButtonDisabledStatus()}
        />
      </form>
    </Box>
  );
};

export default LogisticsPage;
