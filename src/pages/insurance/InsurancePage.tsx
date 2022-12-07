import { BusinessService } from '@appjusto/types';
import {
  Box,
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
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { MdCheck } from 'react-icons/md';
import { Redirect } from 'react-router-dom';
import { formatPct } from 'utils/formatters';
import { t } from 'utils/i18n';

const InsurancePage = ({ onboarding, redirect }: OnboardingProps) => {
  // context
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
  // handlers
  const onSubmitHandler = (event: any) => {
    event.preventDefault();
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
        updateBusinessProfile({ services: [insuranceAvailable] });
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
  // side effects
  React.useEffect(() => {
    if (!business?.services) return;
    const insurance = business.services.find(
      (service) => service.name === 'insurance'
    );
    setInsuranceAccepted(insurance);
  }, [business?.services]);
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
        <RadioGroup
          mt="8"
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
                  {t(
                    'Cancelamento após início do preparo por prevenção de fraude'
                  )}
                </Text>
              </HStack>
              <HStack spacing={4}>
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
