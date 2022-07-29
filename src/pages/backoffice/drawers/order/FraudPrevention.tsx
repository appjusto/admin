import { Box, Button, Flex, Icon, Stack, Text, Textarea } from '@chakra-ui/react';
import { useObserveOrderFraudPrevention } from 'app/api/order/useObserveOrderFraudPrevention';
import { useContextFirebaseUser } from 'app/state/auth/context';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import React from 'react';
import { MdInfo, MdPolicy, MdWarningAmber } from 'react-icons/md';
import { t } from 'utils/i18n';
import { OrderDrawerLoadingState } from '.';
import { SectionTitle } from '../generics/SectionTitle';

interface FraudPreventionProps {
  orderId: string;
  canUpdateOrder?: boolean;
  message?: string;
  updateMessage(message: string): void;
  handleConfirm(removeStaff: boolean): void;
  handleCancel(): void;
  loadingState: OrderDrawerLoadingState;
}

export const FraudPrevention = ({
  orderId,
  canUpdateOrder,
  message,
  updateMessage,
  handleConfirm,
  handleCancel,
  loadingState,
}: FraudPreventionProps) => {
  // context
  const { isBackofficeSuperuser } = useContextFirebaseUser();
  const flags = useObserveOrderFraudPrevention(orderId);
  // state
  const [removeStaff, setRemoveStaff] = React.useState(true);
  // UI
  return (
    <Box
      mt="4"
      p="6"
      border="2px solid red"
      borderRadius="lg"
      bgColor="rgb(254, 215, 215)"
      color="black"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <SectionTitle mt="0">{t('Prevenção de fraudes')}</SectionTitle>
        <Icon as={MdPolicy} w="24px" h="24px" />
      </Flex>
      <Text mt="4">
        {t('Características que podem indicar tentativa de fraude:')}
      </Text>
      {flags?.newUser && (
        <Text mt="1" fontWeight="700">
          <Icon as={MdWarningAmber} mr="2" /> {t('Novo;')}
        </Text>
      )}
      {flags?.consumerHasConfirmedPhoneNumber === false && (
        <Text mt="1" fontWeight="700">
          <Icon as={MdWarningAmber} mr="2" />{' '}
          {t('Não confirmou o telefone;')}
        </Text>
      )}
      {flags?.consumerHasPlacedTooManyOrdersRecently && (
        <Text mt="1" fontWeight="700">
          <Icon as={MdWarningAmber} mr="2" /> {t('Muitos pedidos recentemente;')}
        </Text>
      )}
      {flags?.consumerHasSuspectInvoices && (
        <Text mt="1" fontWeight="700">
          <Icon as={MdWarningAmber} mr="2" /> {t('Faturas anteriores suspeitas;')}
        </Text>
      )}
      {flags?.highTicketPrice && (
        <Text mt="1" fontWeight="700">
          <Icon as={MdWarningAmber} mr="2" /> {t('Preço elevado;')}
        </Text>
      )}
      {flags?.flaggedLocationsNearby && (
        <Text mt="1" fontWeight="700">
          <Icon as={MdWarningAmber} mr="2" /> {t('Local próximo a uma fraude anterior;')}
        </Text>
      )}
      {canUpdateOrder ? (
        <>
          <SectionTitle>{t('Comentário:')}</SectionTitle>
          <Textarea
            mt="2"
            bgColor="white"
            value={message}
            onChange={(ev) => updateMessage(ev.target.value)}
            backgroundColor="#F6F6F6"
          />
          <Text mt="4">
            {t('Se nenhuma ação for tomada, o pedido será confirmado dentro de instantes:')}
          </Text>
          {
            isBackofficeSuperuser && (
              <Box mt="4">
                <CustomCheckbox 
                  colorScheme="green"
                  isChecked={removeStaff} 
                  onChange={() => setRemoveStaff(prev => !prev)}>
                  {t('Sair do pedido após a triagem')}
                </CustomCheckbox>
              </Box>
            )
          }
          <Stack mt="4" direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Button
              w="100%"
              size="md"
              variant="danger"
              onClick={handleCancel}
              isLoading={loadingState === 'preventCancel'}
              loadingText={t('Cancelando')}
            >
              {t('Rejeitar pedido')}
            </Button>
            <Button
              w="100%"
              size="md"
              onClick={() => handleConfirm(removeStaff)}
              isLoading={loadingState === 'preventConfirm'}
              loadingText={t('Salvando')}
            >
              {t('Confirmar pedido')}
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Text mt="4">
            <Icon as={MdInfo} mr="2" mb="-0.5" />
            {t('É preciso assumir o pedido para realizar alguma ação.')}
          </Text>
          <Text mt="2">
            {t('Se nenhuma ação for tomada, o pedido será confirmado dentro de instantes.')}
          </Text>
        </>
      )}
    </Box>
  );
};
