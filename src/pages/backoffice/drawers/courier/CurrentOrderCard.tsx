import { Order, WithId } from "@appjusto/types";
import {
  Box, Flex,
  HStack, Text
} from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { t } from 'utils/i18n';

interface CurrentOrderCardProps {
  courierId?: string | null;
  order: WithId<Order>;
}


export const CurrentOrderCard = ({ order }: CurrentOrderCardProps) => {
  // helpers
  const orderType = order?.type
    ? order.type === 'food'
      ? 'Comida'
      : 'Entrega'
    : 'N/E';
  // UI
  return (
    <Flex
      mt="4"
      flexDir={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      p="4"
      border="1px solid #C8D7CB"
      borderRadius="lg"
    >
      <HStack spacing={4}>
        <Text color="black" fontSize="26px" fontWeight="500" lineHeight="28px">
          #{order?.code ?? 'N/E'}
        </Text>
        <Box>
          <Text fontSize="13px" fontWeight="500" lineHeight="12px" color="green.600">
            {orderType}
          </Text>
          {order?.type === 'food' && (
            <Text fontSize="16px" fontWeight="500" lineHeight="18px">
              {order?.business?.name ?? 'N/E'}
            </Text>
          )}
        </Box>
      </HStack>
      <CustomButton
        mt="0"
        w="100%"
        minW="166px"
        size="md"
        variant="outline"
        label={t('Ver pedido')}
        link={`/backoffice/orders/${order.id}`}
      />
    </Flex>
  )
}