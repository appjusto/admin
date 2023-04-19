import { BusinessSettings } from '@appjusto/types';
import { Box, Button, Image, Stack, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { BaseModal } from 'common/components/BaseModal';
import gif from 'common/img/insurance.gif';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { t } from 'utils/i18n';

interface InsuranceModalProps {
  isOpen: boolean;
}

export const InsuranceModal = ({ isOpen }: InsuranceModalProps) => {
  // context
  const { push } = useHistory();
  const { business } = useContextBusiness();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  // state
  const [redirect, setRedirect] = React.useState(false);
  // handlers
  const handleAcknownledgement = React.useCallback(
    (redirect?: boolean) => {
      if (!business) {
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'insurance-modal-error',
          message: {
            title: 'Não foi possível encontrar as informações do restaurante.',
          },
        });
      }
      if (redirect) setRedirect(true);
      try {
        const settings = {
          ...business.settings,
          acknowledgeInsurance: true,
        } as BusinessSettings;
        updateBusinessProfile({ settings });
      } catch (error) {}
    },
    [business, dispatchAppRequestResult, updateBusinessProfile]
  );
  // side effects
  React.useEffect(() => {
    if (!redirect) return;
    if (!updateResult.isSuccess) return;
    push('/app/insurance');
  }, [redirect, updateResult.isSuccess, push]);
  // UI
  return (
    <BaseModal
      size="xl"
      isOpen={isOpen}
      onClose={() => {}}
      footer={
        <Stack
          mt="4"
          w="100%"
          direction={{ base: 'column', md: 'row' }}
          justifyContent={{ md: 'flex-end' }}
          spacing={4}
        >
          <Button
            w={{ base: '100%', md: 'auto' }}
            variant="secondary"
            onClick={() => handleAcknownledgement()}
          >
            {t('Continuar sem cobertura')}
          </Button>
          <Button
            w={{ base: '100%', md: 'auto' }}
            fontSize="md"
            onClick={() => handleAcknownledgement(true)}
          >
            {t('Quero saber mais')}
          </Button>
        </Stack>
      }
      closeButton={false}
    >
      <Box mt="2" borderRadius="lg" overflow="hidden">
        <Image src={gif} w="full" />
      </Box>
      <Box mt="6">
        <Text fontSize="20px" fontWeight="700">
          {t('Cobertura AppJusto')}
        </Text>
        <Text mt="4">
          {t(
            'Como você sabe, algumas situações de problemas operacionais na entrega são de responsabilidade do restaurante.'
          )}
        </Text>
        <Text mt="4">
          {t('Entretanto, ')}
          <Text as="span" fontWeight="700">
            {t(
              'o AppJusto está disponibilizando a opção de um plano de cobertura por + 3,5% do valor da venda que cobre a maior parte desses problemas. Quer saber mais?'
            )}
          </Text>
        </Text>
      </Box>
    </BaseModal>
  );
};
