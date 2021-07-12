import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { DispatchingStatus } from 'appjusto-types/order/dispatching';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { t } from 'utils/i18n';

interface CourierNotifiedBoxProps {
  isOrderActive: boolean;
  orderId: string;
  courierId: string;
  issue?: string;
  dispatchingStatus?: DispatchingStatus;
  removeCourier(courierId: string): void;
  allocateCourier(courierId: string): void;
  courierRemoving?: string | null;
  isLoading?: boolean;
}

export const CourierNotifiedBox = ({
  isOrderActive,
  courierId,
  issue,
  dispatchingStatus,
  removeCourier,
  allocateCourier,
  courierRemoving,
  isLoading = false,
}: CourierNotifiedBoxProps) => {
  // context
  const shortId = courierId.substring(0, 7) + '...';
  return (
    <Box p="3" border="1px solid #ECF0E3" borderRadius="lg" bg="white">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text>{shortId}</Text>
          {issue && <Text>{issue}</Text>}
        </Box>
        <HStack>
          <CustomButton
            mt="0"
            size="sm"
            w="120px"
            h="36px"
            label={t('Ver cadastro')}
            link={`/backoffice/couriers/${courierId}`}
            variant="outline"
          />
          <CustomButton
            mt="0"
            size="sm"
            w="120px"
            h="36px"
            label={t('Remover')}
            variant="danger"
            isDisabled={
              !isOrderActive || dispatchingStatus === 'matched' || dispatchingStatus === 'confirmed'
            }
            isLoading={isLoading && courierRemoving === courierId}
            onClick={() => removeCourier && removeCourier(courierId)}
          />
          <CustomButton
            mt="0"
            size="sm"
            w="120px"
            h="36px"
            label={t('Alocar')}
            isDisabled={
              !isOrderActive || dispatchingStatus === 'matched' || dispatchingStatus === 'confirmed'
            }
            isLoading={isLoading && !courierRemoving}
            onClick={() => allocateCourier(courierId)}
          />
        </HStack>
      </Flex>
    </Box>
  );
};
