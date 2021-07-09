import { Box, HStack, Text } from '@chakra-ui/react';
import { useCourierSearch } from 'app/api/courier/useCourierSearch';
import { DispatchingStatus } from 'appjusto-types/order/dispatching';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../generics/SectionTitle';
import { ManualAllocationTable } from './ManualAllocationTable';

interface ManualAllocationProps {
  orderId?: string;
  dispatchingStatus?: DispatchingStatus;
}

export const ManualAllocation = ({ orderId, dispatchingStatus }: ManualAllocationProps) => {
  // states
  const [searchId, setSearchId] = React.useState('');
  const [searchName, setSearchName] = React.useState('');
  // search
  const { couriers, courierManualAllocation, allocationResult } = useCourierSearch(
    orderId,
    searchId,
    searchName
  );
  const { isLoading, isSuccess, isError, error } = allocationResult;
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
          allocationFn={courierManualAllocation}
          isLoading={isLoading}
        />
      )}
      <SuccessAndErrorHandler
        submission={0}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
      />
    </Box>
  );
};
