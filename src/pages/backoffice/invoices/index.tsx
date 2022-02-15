import { ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useObserveInvoices } from 'app/api/order/useObserveInvoices';
import { IuguInvoiceStatus } from 'appjusto-types/payment/iugu';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { InvoiceDrawer } from '../drawers/invoice';
import { InvoicesTable } from './InvoicesTable';

const InvoicesPage = () => {
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');
  const [filterBar, setFilterBar] = React.useState<'created' | IuguInvoiceStatus>();
  const [clearDateNumber, setClearDateNumber] = React.useState(0);
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { invoices, fetchNextPage } = useObserveInvoices(searchId, searchFrom, searchTo, filterBar);
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
      <PageHeader title={t('Faturas')} subtitle={t(`Atualizado ${dateTime}`)} />
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
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <FiltersScrollBar>
          <HStack spacing={4}>
            <FilterText
              isActive={!filterBar}
              label={t('Todas')}
              onClick={() => setFilterBar(undefined)}
            />
            <FilterText
              isActive={filterBar === 'created'}
              label={t('Criada')}
              onClick={() => setFilterBar('created')}
            />
            <FilterText
              isActive={filterBar === 'in_analysis'}
              label={t('Análise')}
              onClick={() => setFilterBar('in_analysis')}
            />
            <FilterText
              isActive={filterBar === 'pending'}
              label={t('Pendente')}
              onClick={() => setFilterBar('pending')}
            />
            <FilterText
              isActive={filterBar === 'paid'}
              label={t('Paga')}
              onClick={() => setFilterBar('paid')}
            />
            <FilterText
              isActive={filterBar === 'refunded'}
              label={t('Reembol.')}
              onClick={() => setFilterBar('refunded')}
            />
            <FilterText
              isActive={filterBar === 'canceled'}
              label={t('Cancelada')}
              onClick={() => setFilterBar('canceled')}
            />
            <FilterText
              isActive={filterBar === 'in_protest'}
              label={t('Protesto')}
              onClick={() => setFilterBar('in_protest')}
            />
            <FilterText
              isActive={filterBar === 'chargeback'}
              label={t('Estorno')}
              onClick={() => setFilterBar('chargeback')}
            />
          </HStack>
        </FiltersScrollBar>
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${invoices?.length ?? '0'} itens na lista`)}
        </Text>
      </HStack>
      <InvoicesTable invoices={invoices} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:invoiceId`}>
          <InvoiceDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default InvoicesPage;
