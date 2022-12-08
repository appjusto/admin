import { BusinessService } from '@appjusto/types';
import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Radio,
  RadioGroup,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextServerTime } from 'app/state/server-time';
import dayjs from 'dayjs';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { MdCheck, MdInfo } from 'react-icons/md';
import { Redirect } from 'react-router-dom';
import { formatPct } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

const InsurancePage = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { user, isBackofficeUser } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, insuranceAvailable } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isLoading, isSuccess } = updateResult;
  // state
  const [insuranceAccepted, setInsuranceAccepted] =
    React.useState<BusinessService>();
  const [isAccept, setIsAccept] = React.useState(false);
  // helpers
  const feeToDisplay =
    insuranceAccepted?.fee.percent ?? insuranceAvailable?.fee.percent;
  const totalFee = feeToDisplay ? 7.42 + feeToDisplay : undefined;
  const insuranceActivationDate = insuranceAccepted?.createdOn
    ? dayjs(insuranceAccepted.createdOn).toDate()
    : null;
  const insuranceActivatedAt = insuranceActivationDate
    ? getDateAndHour(insuranceActivationDate)
    : null;
  // handlers
  const onSubmitHandler = (event: any) => {
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
    if (!isAccept && !insuranceAccepted)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'insurance-page-error',
        message: { title: 'Nenhuma cobertura foi contratada.' },
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
        const services = business?.services?.filter(
          (service) => service.name !== 'insurance'
        );
        updateBusinessProfile({ services });
      }
    } catch (error) {
      console.log(error);
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
    if (!business?.services) return;
    const insurance = business.services.find(
      (service) => service.name === 'insurance'
    );
    setInsuranceAccepted(insurance);
  }, [servivesLength, business?.services]);
  React.useEffect(() => {
    setIsAccept(insuranceAccepted !== undefined);
  }, [insuranceAccepted]);
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
          <VStack spacing={4} alignItems="flex-start">
            <Box
              p="6"
              w="100%"
              maxW="600px"
              border="1px solid #C8D7CB"
              borderRadius="lg"
              boxShadow="0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)"
            >
              <Radio value="no-insurance">
                <Text fontSize="18px" fontWeight="700">
                  {t('Sem cobertura')}
                </Text>
              </Radio>
              <Text mt="4">
                {t(
                  'Ao optar por trabalhar com o AppJusto, no modelo sem cobertura, o restaurante está de acordo em assumir a responsabilidade financeira pelos eventuais problemas operacionais que venham a acontecer com seus pedidos.'
                )}
              </Text>
              <HStack
                mt="4"
                spacing={3}
                justifyContent="flex-end"
                alignItems="flex-start"
              >
                <Box maxW="70px" textAlign="center">
                  <Flex h="40px" justifyContent="center" alignItems="flex-end">
                    <Text fontSize="20px" fontWeight="700">
                      {t('5%')}
                    </Text>
                  </Flex>
                  <Text fontSize="13px">{t('Comissão AppJusto')}</Text>
                </Box>
                <Box maxW="70px" textAlign="center">
                  <Flex h="40px" justifyContent="center" alignItems="flex-end">
                    <Text fontSize="20px" fontWeight="700">
                      {t('2,42%')}
                    </Text>
                  </Flex>
                  <Text fontSize="13px">{t('Taxa Gateway')}</Text>
                </Box>
                <Box maxW="90px" textAlign="center">
                  <Flex h="40px" justifyContent="center" alignItems="flex-end">
                    <Text fontSize="28px" fontWeight="700">
                      {t('7,42%')}
                    </Text>
                  </Flex>
                  <Text fontSize="13px">{t('Taxa Total')}</Text>
                </Box>
              </HStack>
            </Box>
            <Box
              p="6"
              w="100%"
              maxW="600px"
              border="1px solid #C8D7CB"
              borderRadius="lg"
              boxShadow="0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)"
            >
              <Radio value="insurance">
                <Text fontSize="18px" fontWeight="700">
                  {t('Com cobertura')}
                </Text>
              </Radio>
              <Text mt="4">
                {t(
                  'No modelo com cobertura, o AppJusto disponibiliza reembolsos automáticos, dos valores dos produtos, para os seguintes casos:'
                )}
              </Text>
              <HStack mt="4" spacing={4}>
                <Icon as={MdCheck} color="green.500" w="24px" h="24px" />
                <Text fontWeight="700">
                  {t('Cliente não consegue receber, por atraso na entrega')}
                </Text>
              </HStack>
              <HStack spacing={4}>
                <Icon as={MdCheck} color="green.500" w="24px" h="24px" />
                <Text fontWeight="700">
                  {t('Produto sem qualidade (estragado)')}
                </Text>
              </HStack>
              <HStack spacing={4}>
                <Icon as={MdCheck} color="green.500" w="24px" h="24px" />
                <Text fontWeight="700">
                  {t('Produto chegou violado ou danificado')}
                </Text>
              </HStack>
              <HStack spacing={4}>
                <Icon as={MdCheck} color="green.500" w="24px" h="24px" />
                <Text fontWeight="700">{t('Fraude (chargeback)')}</Text>
              </HStack>
              <HStack
                mt="4"
                spacing={3}
                justifyContent="flex-end"
                alignItems="flex-start"
              >
                <Box maxW="70px" textAlign="center">
                  <Flex h="40px" justifyContent="center" alignItems="flex-end">
                    <Text fontSize="20px" fontWeight="700">
                      {t('5%')}
                    </Text>
                  </Flex>
                  <Text fontSize="13px">{t('Comissão AppJusto')}</Text>
                </Box>
                <Box maxW="70px" textAlign="center">
                  <Flex h="40px" justifyContent="center" alignItems="flex-end">
                    <Text fontSize="20px" fontWeight="700">
                      {t('2,42%')}
                    </Text>
                  </Flex>
                  <Text fontSize="13px">{t('Taxa Gateway')}</Text>
                </Box>
                <Box maxW="70px" textAlign="center">
                  <Flex h="40px" justifyContent="center" alignItems="flex-end">
                    {feeToDisplay ? (
                      <Text fontSize="20px" fontWeight="700">
                        {formatPct(feeToDisplay, 1)}
                      </Text>
                    ) : (
                      <Skeleton />
                    )}
                  </Flex>
                  <Text fontSize="13px">{t('Taxa Cobertura')}</Text>
                </Box>
                <Box maxW="90px" textAlign="center">
                  <Flex h="40px" justifyContent="center" alignItems="flex-end">
                    {totalFee ? (
                      <Text fontSize="28px" fontWeight="700">
                        {formatPct(totalFee, 1)}
                      </Text>
                    ) : (
                      <Skeleton />
                    )}
                  </Flex>
                  <Text fontSize="13px">{t('Taxa Total')}</Text>
                </Box>
              </HStack>
            </Box>
          </VStack>
        </RadioGroup>
        {!insuranceAccepted && onboarding && (
          <Flex
            mt="8"
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
        )}
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

export default InsurancePage;
