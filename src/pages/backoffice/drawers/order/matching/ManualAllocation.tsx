import { Box, HStack, Text } from '@chakra-ui/react';
import { useCourierSearch } from 'app/api/courier/useCourierSearch';
import { DispatchingStatus } from 'appjusto-types/order/dispatching';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../generics/SectionTitle';
import { ManualAllocationTable } from './ManualAllocationTable';

interface ManualAllocationProps {
  orderId?: string;
  dispatchingStatus?: DispatchingStatus;
}

const initialSub = 0;

export const ManualAllocation = ({ orderId, dispatchingStatus }: ManualAllocationProps) => {
  // states
  const [searchId, setSearchId] = React.useState('');
  const [searchName, setSearchName] = React.useState('');
  const [error, setError] = React.useState(initialError);
  // search
  const { couriers, courierManualAllocation, allocationResult } = useCourierSearch(
    orderId,
    searchId,
    searchName
  );
  const { isLoading, isError, error: allocationError } = allocationResult;
  // refs
  const submission = React.useRef(initialSub);
  // handlers
  const handleAllocation = (courierId: string) => {
    submission.current += 1;
    setError({
      status: false,
      error: null,
    });
    courierManualAllocation(courierId);
  };
  // side effects
  React.useEffect(() => {
    if (isError) {
      setError({
        status: true,
        error: allocationError,
        message: { title: 'Operação negada!', description: `${allocationError}` },
      });
    }
  }, [isError, allocationError]);
  // UI
  if (dispatchingStatus === 'matched' || dispatchingStatus === 'confirmed') {
    return (
      <Box>
        <SectionTitle>{t('Alocar entregador manualmente')}</SectionTitle>
        <AlertSuccess title={t('Entregador alocado.')} />
      </Box>
    );
  }
  return (
    <Box>
      <SectionTitle>{t('Alocar entregador manualmente')}</SectionTitle>
      <Text mt="4">{t('Encontre o entregador para receber o pedido')}</Text>
      <HStack mt="4">
        <CustomInput
          mt="0"
          w="100%"
          maxW="160px"
          id="search-id"
          value={searchId}
          onChange={(event) => {
            setSearchName('');
            setSearchId(event.target.value);
          }}
          label={t('ID')}
          placeholder={t('0000')}
        />
        <CustomInput
          mt="0"
          w="100%"
          id="search-name"
          value={searchName}
          onChange={(event) => {
            setSearchId('');
            setSearchName(event.target.value);
          }}
          label={t('Nome')}
          placeholder={t('Nome do entregador')}
        />
      </HStack>
      {couriers && (
        <ManualAllocationTable
          couriers={couriers}
          allocationFn={handleAllocation}
          isLoading={isLoading}
        />
      )}
      <SuccessAndErrorHandler
        submission={submission.current}
        isError={error.status}
        errorMessage={error.message}
      />
    </Box>
  );
};
