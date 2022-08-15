import { LedgerEntryStatus } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useObserveLedger } from 'app/api/ledger/useObserveLedger';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { LedgerEntryDrawer } from '../drawers/ledger-entry';
import { EntriesTable } from './EntriesTable';

const LedgerPage = () => {
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');
  const [filterBar, setFilterBar] = React.useState<LedgerEntryStatus>();
  const [clearDateNumber, setClearDateNumber] = React.useState(0);
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { entries, fetchNextPage } = useObserveLedger(
    searchId,
    searchFrom,
    searchTo,
    filterBar
  );
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  const clearFilters = () => {
    setClearDateNumber((prev) => prev + 1);
    setSearchId('');
    setSearchFrom('');
    setSearchTo('');
    setFilterBar(undefined);
  };
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  // UI
  return (
    <Box>
      <PageHeader
        title={t('Conciliações')}
        subtitle={t(`Atualizado ${dateTime}`)}
      />
      <Flex mt="8">
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
          <CustomInput
            mt="0"
            minW="230px"
            id="search-id"
            value={searchId}
            onChange={(event) => setSearchId(event.target.value)}
            label={t('ID')}
            placeholder={t('ID do pedido')}
          />
          <CustomDateFilter
            getStart={setSearchFrom}
            getEnd={setSearchTo}
            clearNumber={clearDateNumber}
          />
        </Stack>
      </Flex>
      <Flex
        mt="8"
        w="100%"
        justifyContent="space-between"
        borderBottom="1px solid #C8D7CB"
      >
        <FiltersScrollBar>
          <HStack spacing={4}>
            <FilterText
              isActive={!filterBar}
              label={t('Todas')}
              onClick={() => setFilterBar(undefined)}
            />
            <FilterText
              isActive={filterBar === 'pending'}
              label={t('Pendente')}
              onClick={() => setFilterBar('pending')}
            />
            <FilterText
              isActive={filterBar === 'processing'}
              label={t('Processando')}
              onClick={() => setFilterBar('processing')}
            />
            <FilterText
              isActive={filterBar === 'paid'}
              label={t('Paga')}
              onClick={() => setFilterBar('paid')}
            />
            <FilterText
              isActive={filterBar === 'canceled'}
              label={t('Cancelada')}
              onClick={() => setFilterBar('canceled')}
            />
          </HStack>
        </FiltersScrollBar>
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <Flex mt="6" color="black" justifyContent="space-between">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${entries?.length ?? '0'} itens na lista`)}
        </Text>
        <CustomButton
          mt="0"
          label={t('Criar transferência')}
          link={`${path}/new`}
        />
      </Flex>
      <EntriesTable entries={entries} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:entryId`}>
          <LedgerEntryDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default LedgerPage;
