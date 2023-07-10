import { ComplaintStatus } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useObserveComplaints } from 'app/api/complaints/useObserveComplaints';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { Select } from 'common/components/form/select/Select';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { ComplaintDrawer } from '../drawers/complaint';
import { ComplaintsTable } from './ComplaintsTable';

const statusFilterOptions = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Em investigação', value: 'investigating' },
  { label: 'Aceitas', value: 'upheld' },
  { label: 'Inconclusivas', value: 'inconclusive' },
];

type SearchType = 'order' | 'complainant' | 'date';

const ComplaintsPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [type, setType] = React.useState<SearchType>('order');
  const [search, setSearch] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');
  const [status, setStatus] = React.useState<ComplaintStatus>();
  const [clearDateNumber, setClearDateNumber] = React.useState(0);

  const { complaints, fetchNextPage } = useObserveComplaints(
    status,
    type === 'order' ? search : undefined,
    type === 'complainant' ? search : undefined,
    searchFrom,
    searchTo
  );

  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };

  const clearFilters = () => {
    setClearDateNumber((prev) => prev + 1);
    setSearch('');
    setSearchFrom('');
    setSearchTo('');
  };

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  // UI
  return (
    <>
      <PageHeader
        title={t('Denúncias')}
        subtitle={t(`Atualizado ${dateTime}`)}
      />
      <Flex mt="6">
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
          <Select
            mt="0"
            minW={{ md: '140px' }}
            label={t('Tipo de dado:')}
            value={type}
            onChange={(e) => setType(e.target.value as SearchType)}
          >
            <option value="order">{t('Pedido')}</option>
            <option value="complainant">{t('Autor')}</option>
            <option value="date">{t('Data')}</option>
          </Select>
          {type !== 'date' ? (
            <CustomInput
              mt="0"
              minW={{ lg: '400px' }}
              id="search-id"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              label={t('Busca por ID')}
              placeholder={t('Digite o ID do documento')}
            />
          ) : (
            <CustomDateFilter
              getStart={setSearchFrom}
              getEnd={setSearchTo}
              clearNumber={clearDateNumber}
            />
          )}
        </Stack>
      </Flex>
      <Flex
        mt="6"
        w="100%"
        justifyContent="flex-end"
        borderBottom="1px solid #C8D7CB"
      >
        <FiltersScrollBar
          filters={statusFilterOptions}
          currentValue={status ?? 'all'}
          selectFilter={(value: string) => {
            if (value === 'all') setStatus(undefined);
            else setStatus(undefined);
          }}
        />
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${complaints?.length ?? '0'} documentos encontrados`)}
        </Text>
      </HStack>
      <ComplaintsTable complaints={complaints} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route exact path={`${path}/:complaintId`}>
          <ComplaintDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default ComplaintsPage;
