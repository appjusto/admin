import { ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, CheckboxGroup, Flex, HStack, Text } from '@chakra-ui/react';
import { useObserveUsers } from 'app/api/users/useObserveUsers';
import { UsersSearchType, UserType } from 'app/api/users/UsersApi';
import { FilterText } from 'common/components/backoffice/FilterText';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BackofficeOrderDrawer } from '../drawers/order';
import { UsersTable } from './UsersTable';

const UsersPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [loggedAt, setLoggedAt] = React.useState<UserType[]>([]);
  //const [filterBar, setFilterBar] = React.useState('all');
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [searchType, setSearchType] = React.useState<UsersSearchType>('email');
  const [search, setSearch] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');

  const [clearDateNumber, setClearDateNumber] = React.useState(0);

  const { users, fetchNextPage } = useObserveUsers(
    loggedAt,
    searchType,
    search,
    isBlocked,
    searchFrom,
    searchTo
  );

  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };

  const clearFilters = () => {
    setClearDateNumber((prev) => prev + 1);
    setLoggedAt([]);
    setIsBlocked(false);
    setSearchType('email');
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
      <PageHeader title={t('Usuários')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="8">
        <HStack spacing={4}>
          <CustomInput
            mt="0"
            maxW="212px"
            id="search-id"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            label={t('ID')}
            placeholder={t('ID do pedido')}
          />
          <CustomDateFilter
            getStart={setSearchFrom}
            getEnd={setSearchTo}
            clearNumber={clearDateNumber}
          />
        </HStack>
      </Flex>
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <HStack spacing={4}>
          <FilterText isActive={!isBlocked} onClick={() => setIsBlocked(false)}>
            {t('Todos')}
          </FilterText>
          <FilterText isActive={isBlocked} onClick={() => setIsBlocked(true)}>
            {t('Bloqueados')}
          </FilterText>
        </HStack>
        <HStack spacing={2} color="#697667" cursor="pointer" onClick={clearFilters}>
          <DeleteIcon />
          <Text fontSize="15px" lineHeight="21px">
            {t('Limpar filtro')}
          </Text>
        </HStack>
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${users?.length ?? '0'} usuários na lista`)}
        </Text>
        <CheckboxGroup
          colorScheme="green"
          value={loggedAt}
          onChange={(values: UserType[]) => setLoggedAt(values)}
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <CustomCheckbox value="manager">{t('Manager')}</CustomCheckbox>
            <CustomCheckbox value="courier">{t('Entregador')}</CustomCheckbox>
            <CustomCheckbox value="consumer">{t('Consumidor')}</CustomCheckbox>
          </HStack>
        </CheckboxGroup>
      </HStack>
      <UsersTable users={users} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:orderId`}>
          <BackofficeOrderDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default UsersPage;
