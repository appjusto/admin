import { BusinessService } from '@appjusto/types';
import { Button, Flex, Radio, RadioGroup, VStack } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';

const InsurancePage = () => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  const { isLoading } = updateResult;
  // state
  const [selected, setSelected] = React.useState<BusinessService>();
  // refs
  const submission = React.useRef(0);
  // handlers
  const onSubmitHandler = (event: any) => {
    event.preventDefault();
    if (!selected)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'SchedulesPage-valid',
        message: { title: 'Alguns horários não estão corretos.' },
      });
    submission.current += 1;
    updateBusinessProfile({ services: [selected] });
  };
  // side effects
  React.useEffect(() => {
    if (!business?.services) return;
    const insurance = business.services.find(
      (service) => service.name === 'insurance'
    );
    setSelected(insurance);
  }, [business?.services]);
  // UI
  return (
    <>
      <PageHeader
        title={t('Seguro')}
        subtitle={t('Escolha a forma de contratação do AppJusto.')}
      />
      <Flex flexDir="column" mt="4">
        <form onSubmit={onSubmitHandler}>
          <RadioGroup mt="6">
            <VStack alignItems="flex-start">
              <Radio value="insurance">Com seguro</Radio>
              <Radio value="no-insurance">Sem seguro</Radio>
            </VStack>
          </RadioGroup>
          <Button
            mt="8"
            w="200px"
            type="submit"
            fontSize="15px"
            isLoading={isLoading}
            loadingText={t('Salvando')}
          >
            {t('Salvar opção')}
          </Button>
        </form>
      </Flex>
    </>
  );
};

export default InsurancePage;
