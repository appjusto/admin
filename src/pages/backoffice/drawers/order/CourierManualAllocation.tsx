import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';

interface CourierManualAllocationProps {
  allocateCourier(courierInfo: string, comment: string): void;
  isLoading: boolean;
}

export const CourierManualAllocation = ({
  allocateCourier,
  isLoading,
}: CourierManualAllocationProps) => {
  // context
  const { user } = useContextFirebaseUser();
  // state
  const [courierCode, setCourierCode] = React.useState('');
  // UI
  return (
    <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" bg="" p="4">
      <Text fontWeight="700">
        {t('Alocação de entregador por código ou Id')}
      </Text>
      <HStack mt="4">
        <CustomInput
          mt="0"
          id="courier-allocation-code"
          label={t('Informe o código ou Id do entregador')}
          placeholder={t('Digite o identificador')}
          value={courierCode}
          onChange={(ev) => setCourierCode(ev.target.value)}
        />
        <Button
          h="60px"
          w="40%"
          onClick={() =>
            allocateCourier(
              courierCode,
              `Alocação manual por código pelo staff: ${user?.uid}`
            )
          }
          isLoading={isLoading}
          loadingText={t('Alocando...')}
          isDisabled={courierCode.length < 7}
        >
          {t('Alocar')}
        </Button>
      </HStack>
    </Box>
  );
};
