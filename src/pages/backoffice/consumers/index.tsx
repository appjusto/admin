import { ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { SituationFilter } from 'app/api/search/types';
import { useBasicUsersSearch } from 'app/api/search/useBasicUsersSearch';
import { ConsumerAlgolia } from 'appjusto-types';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { ConsumerDrawer } from '../drawers/consumer';
import { ConsumersTable } from './ConsumersTable';

const ConsumersPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');

  const [filterBar, setFilterBar] = React.useState('all');
  const [filters, setFilters] = React.useState<SituationFilter[]>([]);

  const { results: consumers, fetchNextPage } = useBasicUsersSearch<ConsumerAlgolia>(
    true,
    'consumers',
    filters,
    search
  );

  // handlers
  const closeDrawerHandler = () => history.replace(path);

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  React.useEffect(() => {
    let barArray = [] as SituationFilter[];
    if (filterBar === 'all') barArray = [] as SituationFilter[];
    else barArray = [{ type: 'situation', value: filterBar }];
    setFilters([...barArray]);
  }, [filterBar]);

  // UI
  return (
    <>
      <PageHeader title={t('Entregadores')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="8" justifyContent="space-between">
        <CustomInput
          mt="0"
          w="400px"
          id="search-id"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          label={t('Buscar')}
          placeholder={t('Buscar por ID ou nome')}
        />
      </Flex>
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <HStack spacing={4}>
          <FilterText
            isActive={filterBar === 'all' ? true : false}
            onClick={() => setFilterBar('all')}
          >
            {t('Todos')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'approved' ? true : false}
            onClick={() => setFilterBar('approved')}
          >
            {t('Ativos')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'blocked' ? true : false}
            onClick={() => setFilterBar('blocked')}
          >
            {t('Bloqueados')}
          </FilterText>
        </HStack>
        <HStack spacing={2} color="#697667" cursor="pointer" onClick={() => setFilterBar('all')}>
          <DeleteIcon />
          <Text fontSize="15px" lineHeight="21px">
            {t('Limpar filtro')}
          </Text>
        </HStack>
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${consumers?.length ?? '0'} itens na lista`)}
        </Text>
      </HStack>
      <ConsumersTable consumers={consumers} />
      <Button mt="8" variant="grey" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:consumerId`}>
          <ConsumerDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default ConsumersPage;
