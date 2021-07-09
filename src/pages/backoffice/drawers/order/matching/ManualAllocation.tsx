import { Box, Checkbox, Text } from '@chakra-ui/react';
import { useBasicUsersSearch } from 'app/api/search/useBasicUsersSearch';
import { CourierAlgolia } from 'appjusto-types';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../generics/SectionTitle';
import { ManualAllocationTable } from './ManualAllocationTable';

export const ManualAllocation = () => {
  // states
  const [search, setSearch] = React.useState('');
  const [filterCheck, setFilterCheck] = React.useState(true);
  // search
  const { results: couriers } = useBasicUsersSearch<CourierAlgolia>(
    true,
    'couriers',
    filterCheck ? [{ type: 'status', value: 'available' }] : [],
    search
  );

  return (
    <Box>
      <SectionTitle>{t('Alocar entregador manualmente')}</SectionTitle>
      <Text mt="4">{t('Encontre o entregador para receber o pedido')}</Text>
      <CustomInput
        w="100%"
        id="search-id"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        label={t('ID ou nome')}
        placeholder={t('ID ou nome do entregador')}
      />
      <Checkbox
        mt="4"
        iconColor="white"
        colorScheme="green"
        isChecked={filterCheck}
        onChange={(event) => setFilterCheck(event.target.checked)}
      >
        {t('Disponível')}
      </Checkbox>
      <ManualAllocationTable couriers={couriers} />
    </Box>
  );
};
