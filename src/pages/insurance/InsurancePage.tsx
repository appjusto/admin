import { BusinessService } from '@appjusto/types';
import { Box, Radio, RadioGroup, VStack } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
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
          <VStack alignItems="flex-start">
            <Radio value="insurance">Com seguro</Radio>
            <Radio value="no-insurance">Sem seguro</Radio>
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
