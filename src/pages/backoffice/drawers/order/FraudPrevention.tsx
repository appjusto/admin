import { Box, Button, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { useObserveOrderFraudPrevention } from 'app/api/order/useObserveOrderFraudPrevention';
import { MdPolicy, MdWarningAmber } from 'react-icons/md';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface FraudPreventionProps {
  orderId: string;
  handleConfirm(): void;
  handleReject(): void;
}

export const FraudPrevention = ({ orderId, handleConfirm, handleReject }: FraudPreventionProps) => {
  // context
  const flags = useObserveOrderFraudPrevention(orderId);
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
        {t('Este pedido apresenta algumas características que podem indicar tentativa de fraude:')}
      </Text>
      {flags?.newUser && (
        <Text mt="1" fontWeight="700">
          <Icon as={MdWarningAmber} mr="2" /> {t('Primeiro pedido do consumidor;')}
        </Text>
      )}
      {flags?.highTicketPrice && (
        <Text mt="1" fontWeight="700">
          <Icon as={MdWarningAmber} mr="2" /> {t('Preço elevado;')}
        </Text>
      )}
      {flags?.flaggedLocationsNearby && (
        <Text mt="1" fontWeight="700">
          <Icon as={MdWarningAmber} mr="2" /> {t('Endereço próximo a local de fraude confirmada;')}
        </Text>
      )}
      <Text mt="4">
        {t('Se nenhuma ação for tomada, o pedido será confirmado dentro de instantes:')}
      </Text>
      <Stack mt="4" direction={{ base: 'column', md: 'row' }} spacing={4}>
        <Button w="100%" size="md" variant="danger" onClick={handleReject}>
          {t('Rejeitar pedido')}
        </Button>
        <Button w="100%" size="md" onClick={handleConfirm}>
          {t('Confirmar pedido')}
        </Button>
      </Stack>
    </Box>
  );
};
