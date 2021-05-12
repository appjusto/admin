import { ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { BusinessesFilter } from 'app/api/search/types';
import { useBusinessesSearch } from 'app/api/search/useBusinessesSearch';
import { BusinessAlgolia } from 'appjusto-types';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { FilterText } from '../../../common/components/backoffice/FilterText';
import PageHeader from '../../PageHeader';
import { BusinessDrawer } from '../drawers/business';
import { BusinessesTable } from './BusinessesTable';

const BusinessesPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  //const businesses = useBusinesses(options);
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');
  //const [searchName, setSearchName] = React.useState('');
  //const [searchManager, setSearchManager] = React.useState('');
  const [filterBar, setFilterBar] = React.useState('all');
  //const [filterCheck, setFilterCheck] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<BusinessesFilter[]>([]);

  const { results: businesses, fetchNextPage, refetch } = useBusinessesSearch<BusinessAlgolia>(
    true,
    'businesses',
    filters,
    search
  );
  // handlers
  const closeDrawerHandler = () => {
    refetch();
    history.replace(path);
  };

  const clearSearchAndFilter = () => {
    setSearch('');
    setFilterBar('all');
  };

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  React.useEffect(() => {
    let barArray = [] as BusinessesFilter[];
    if (filterBar === 'all') barArray = [] as BusinessesFilter[];
    else if (filterBar === 'pending')
      barArray = [
        { type: 'situation', value: 'submitted' },
        { type: 'situation', value: 'pending' },
      ];
    /*else if (filterBar === 'pending')
      barArray = [
        { type: 'situation', value: 'invalid' },
        { type: 'situation', value: 'verified' },
        { type: 'situation', value: 'rejected' },
      ];*/ else
      barArray = [{ type: 'situation', value: filterBar }];
    /*let checkArray = filterCheck.map((filter) => {
      if (filter === 'enabled') return { type: 'enabled', value: 'true' };
      else return { type: 'situation', value: filter };
    }) as BusinessesFilter[];*/
    setFilters([...barArray]);
  }, [filterBar]);

  // UI
  return (
    <>
      <PageHeader title={t('Restaurantes')} subtitle={t(`Atualizado ${dateTime}`)} />
      <HStack mt="8" spacing={4}>
        <CustomInput
          mt="0"
          w="400px"
          id="search-id"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          label={t('Buscar')}
          placeholder={t('Buscar por ID, nome ou e-mail do administrador')}
        />
        <HStack
          spacing={2}
          w="300px"
          color="#697667"
          cursor="pointer"
          onClick={clearSearchAndFilter}
        >
          <DeleteIcon />
          <Text fontSize="15px" lineHeight="21px">
            {t('Limpar busca/filtro')}
          </Text>
        </HStack>
      </HStack>
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
            {t('Publicados')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'verified' ? true : false}
            onClick={() => setFilterBar('verified')}
          >
            {t('Verificados')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'invalid' ? true : false}
            onClick={() => setFilterBar('invalid')}
          >
            {t('Inválidos')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'rejected' ? true : false}
            onClick={() => setFilterBar('rejected')}
          >
            {t('Rejeitados')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'pending' ? true : false}
            onClick={() => setFilterBar('pending')}
          >
            {t('Pendentes')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'blocked' ? true : false}
            onClick={() => setFilterBar('blocked')}
          >
            {t('Bloqueados')}
          </FilterText>
        </HStack>
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${businesses?.length ?? '0'} itens na lista`)}
        </Text>
        {/*<CheckboxGroup
          colorScheme="green"
          value={filterCheck}
          onChange={(values: string[]) => setFilterCheck(values)}
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <Checkbox iconColor="white" value="verified">
              {t('Verificados')}
            </Checkbox>
            <Checkbox iconColor="white" value="invalid">
              {t('Inválidos')}
            </Checkbox>
            <Checkbox iconColor="white" value="rejected">
              {t('Rejeitados')}
            </Checkbox>
          </HStack>
        </CheckboxGroup>*/}
      </HStack>
      <BusinessesTable businesses={businesses} />
      <Button mt="8" variant="grey" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:businessId`}>
          <BusinessDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default BusinessesPage;
