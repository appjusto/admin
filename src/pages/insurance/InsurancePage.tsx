import { BusinessService } from '@appjusto/types';
import {
  Box,
  Center,
  Checkbox,
  Flex,
  HStack,
  Icon,
  Link,
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
import { FeeDescriptionItem } from 'pages/FeeDescriptionItem';
import { useContextSummary } from 'pages/onboarding/context/summary';
import { OnboardingProps } from 'pages/onboarding/types';
import { OptionCard } from 'pages/OptionCard';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { MdInfo } from 'react-icons/md';
import { Redirect } from 'react-router-dom';
import { getBusinessService } from 'utils/functions';
import { t } from 'utils/i18n';
import { CoverageItem } from './CoverageItem';
import { getBusinessInsuranceActivationDate } from './utils';

const InsurancePage = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { user, isBackofficeUser } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, insuranceAvailable } = useContextBusiness();
  const { updateState } = useContextSummary();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isLoading, isSuccess } = updateResult;
  // state
  const [insuranceAccepted, setInsuranceAccepted] =
    React.useState<BusinessService>();
  const [isAccept, setIsAccept] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  // helpers
  const logisticsService = getBusinessService(business?.services, 'logistics');
  const isLogistics = typeof logisticsService?.name === 'string';
  const feeToDisplay =
    insuranceAccepted?.fee.percent ?? insuranceAvailable?.fee.percent;
  const insuranceActivatedAt =
    getBusinessInsuranceActivationDate(insuranceAccepted);
  // handlers
  const getActionButtonDisabledStatus = React.useCallback(() => {
    if (!onboarding && !isAccept && !insuranceAccepted) return true;
    return false;
  }, [onboarding, isAccept, insuranceAccepted]);
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBackofficeUser)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: {
          title:
            'Apenas donos e gerentes de restaurantes podem ativar ou desativar a cobertura.',
        },
      });
    if (!user?.uid || !user?.email)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: {
          title: 'Não foi possível acessar as credenciais do usuário.',
        },
      });
    if (!insuranceAvailable)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: { title: 'Nenhuma cobertura foi encontrada.' },
      });
    if (isAccept && insuranceAccepted)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: { title: 'A cobertura já foi contratada.' },
      });
    if (!onboarding && !isAccept && !insuranceAccepted)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: { title: 'Nenhuma cobertura foi contratada.' },
      });
    if (isAccept && !agreed)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: {
          title:
            'Por favor, confirme que leu e está de acordo com os termos de cobertura.',
        },
      });
    try {
      if (isAccept) {
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
      } else {
        const services =
          business?.services?.filter(
            (service) => service.name !== 'insurance'
          ) ?? [];
        updateBusinessProfile({ services });
      }
    } catch (error) {
      console.log('InsurancePage onSubmit error: ', error);
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: { title: 'Não foi possível acessar o servidor.' },
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
    if (onboarding) {
      if (isAccept) {
        updateState({
          state: 'insurance',
          value: insuranceAvailable?.fee.percent ?? 0,
        });
      } else {
        updateState({
          state: 'insurance',
          value: 0,
        });
      }
    }
  }, [onboarding, isAccept, insuranceAvailable?.fee, updateState]);
  React.useEffect(() => {
    const insurance = getBusinessService(business?.services, 'insurance');
    setInsuranceAccepted(insurance);
  }, [servivesLength, business?.services]);
  React.useEffect(() => {
    if (onboarding) {
      setIsAccept(true);
    } else {
      setIsAccept(insuranceAccepted !== undefined);
    }
  }, [onboarding, insuranceAccepted]);
  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box maxW="756px">
      <form onSubmit={onSubmitHandler}>
        <PageHeader
          title={t('Cobertura')}
          subtitle={t('Escolha a forma de contratação do AppJusto.')}
        />
        {insuranceAccepted && insuranceActivatedAt && (
          <Flex
            mt="4"
            p="4"
            flexDir="row"
            border="1px solid #C8D7CB"
            borderRadius="lg"
            maxW="600px"
          >
            <Center>
              <Icon as={MdInfo} w="24px" h="24px" />
            </Center>
            <Box ml="4">
              <Text fontWeight="700">
                {t(`Cobertura ativada em ${insuranceActivatedAt}`)}
              </Text>
              {insuranceAccepted.createdBy?.email && (
                <Text fontSize="14px" fontWeight="700">
                  {t('Solicitada por: ')}
                  <Text as="span" fontWeight="500">
                    {insuranceAccepted.createdBy.email}
                  </Text>
                </Text>
              )}
            </Box>
          </Flex>
        )}
        {!insuranceAccepted && !onboarding ? (
          <Flex
            mt="4"
            p="4"
            flexDir="row"
            border="1px solid #C8D7CB"
            borderRadius="lg"
            bgColor="yellow"
            maxW="600px"
          >
            <Center>
              <Icon as={MdInfo} w="24px" h="24px" />
            </Center>
            <Box ml="4">
              <Text fontWeight="700">
                {t('Seu restaurante ainda não possui cobertura')}
              </Text>
              <Text fontSize="13px">
                {t(
                  'Não se preocupe. É possível aderir à nossa cobertura a qualquer momento.'
                )}
              </Text>
            </Box>
          </Flex>
        ) : (
          <Box />
        )}
        <RadioGroup
          mt="4"
          value={isAccept ? 'insurance' : 'no-insurance'}
          onChange={(value) => setIsAccept(value === 'insurance')}
        >
          <VStack spacing={4} alignItems="flex-start" maxW="600px">
            <OptionCard isSelected={isAccept}>
              <Radio value="insurance">
                <Text fontSize="18px">{t('Com cobertura')}</Text>
              </Radio>
              <Text mt="4">
                {t(
                  'Na opção com cobertura, o restaurante será reembolsado caso ocorra:'
                )}
              </Text>
              <VStack
                mt="4"
                spacing={1}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <CoverageItem
                  isVisible={isLogistics}
                  label={t('Cancelamento pelo AppJusto após início do preparo')}
                />
                <CoverageItem
                  isVisible={isLogistics}
                  label={t('Cancelamento por atraso na entrega')}
                />
                <CoverageItem
                  isVisible={isLogistics}
                  label={t(
                    'Cancelamento por falta de disponibilidade de entregador da rede AppJusto'
                  )}
                />
                <CoverageItem
                  isVisible={isLogistics}
                  label={t(
                    'Defeito no produto (ex: embalagem violada, perda da qualidade do produto, etc) desde que ocasionado por problema na entrega'
                  )}
                />
                <CoverageItem
                  isVisible={isLogistics}
                  label={t('Extravio dos produtos')}
                />
                <CoverageItem isVisible label={t('Fraude (Chargeback)')} />
              </VStack>
              {typeof feeToDisplay === 'number' && (
                <FeeDescriptionItem
                  title={t('Taxa de cobertura')}
                  description={t(
                    'Taxa de cobertura sobre incidentes com pedidos'
                  )}
                  fee={feeToDisplay}
                  highlight
                />
              )}
              <Box
                mt="4"
                px="4"
                py="2"
                w="fit-content"
                minW={{ lg: '346px' }}
                bgColor="#F5F5F5"
                borderRadius="lg"
              >
                <HStack>
                  {isAccept && !insuranceAccepted && (
                    <Checkbox
                      size="sm"
                      isChecked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      isDisabled={!isAccept}
                    />
                  )}
                  <Text>
                    {isAccept && !insuranceAccepted
                      ? t('Li e estou de acordo com os ')
                      : t('Leia a versão completa dos ')}
                    <Link
                      href="https://appjusto.freshdesk.com/support/solutions/articles/67000713547"
                      fontWeight="700"
                      textDecor="underline"
                      isExternal
                    >
                      {t('termos de cobertura.')}
                    </Link>
                  </Text>
                </HStack>
              </Box>
            </OptionCard>
            <OptionCard isSelected={!isAccept}>
              <Radio value="no-insurance">
                <Text fontSize="18px">{t('Sem cobertura')}</Text>
              </Radio>
              <Text mt="4">
                {t(
                  'Na opção sem cobertura, o restaurante será responsável pelas situações listadas nos nossos '
                )}
                <Link
                  href="https://github.com/appjusto/docs/blob/main/legal/termos-de-uso-restaurantes.md#3-pre%C3%A7o"
                  fontWeight="700"
                  textDecor="underline"
                  isExternal
                >
                  {t('termos de uso')}
                </Link>
                {t(' da plataforma.')}
              </Text>
              <FeeDescriptionItem
                title={t('Taxa de cobertura')}
                description={t(
                  'Taxa de cobertura sobre incidentes com pedidos'
                )}
                fee={0}
              />
            </OptionCard>
          </VStack>
        </RadioGroup>
        <PageFooter
          onboarding={onboarding}
          requiredLabel={false}
          redirect={redirect}
          isLoading={isLoading}
          isDisabled={getActionButtonDisabledStatus()}
        />
      </form>
    </Box>
  );
};

export default InsurancePage;
