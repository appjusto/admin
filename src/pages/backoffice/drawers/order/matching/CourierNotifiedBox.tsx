import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { t } from 'utils/i18n';

interface CourierNotifiedBoxProps {
  isOrderActive: boolean;
  courierId: string;
  issue?: string;
  removeCourier?(courierId: string): void;
  courierRemoving?: string | null;
  isLoading?: boolean;
}

export const CourierNotifiedBox = ({
  isOrderActive,
  courierId,
  issue,
  removeCourier,
  courierRemoving,
  isLoading = false,
}: CourierNotifiedBoxProps) => {
  return (
    <Box p="3" border="1px solid #ECF0E3" borderRadius="lg" bg="white">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text>{courierId}</Text>
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
            isDisabled={!isOrderActive}
            isLoading={isLoading && courierRemoving === courierId}
            onClick={() => removeCourier && removeCourier(courierId)}
          />
        </HStack>
      </Flex>
    </Box>
  );
};
