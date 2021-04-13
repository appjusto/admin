import { DeleteIcon } from '@chakra-ui/icons';
import { Checkbox, CheckboxGroup, Flex, HStack, Text } from '@chakra-ui/react';
import { CourierProfile, WithId } from 'appjusto-types';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BusinessDrawer } from '../drawers/business';
import { CouriersTable } from './CouriersTable';

const options = { active: true, inactive: true };

const CouriersPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const couriers = [] as WithId<CourierProfile>[];
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [searchName, setSearchName] = React.useState('');

  const [filterText, setFilterText] = React.useState('all');
  const [filters, setFilters] = React.useState<string[]>([]);

  // handlers
  const closeDrawerHandler = () => history.replace(path);

  const handleFilterTexts = (value: string) => {
    setFilterText(value);
  };

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
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
            isActive={filterText === 'all' ? true : false}
            onClick={() => handleFilterTexts('all')}
          >
            {t('Todos')}
          </FilterText>
          <FilterText
            isActive={filterText === 'las30days' ? true : false}
            onClick={() => handleFilterTexts('las30days')}
          >
            {t('Ativos nos últimos 30 dias')}
          </FilterText>
          <FilterText
            isActive={filterText === 'blocked' ? true : false}
            onClick={() => handleFilterTexts('blocked')}
          >
            {t('Bloqueados')}
          </FilterText>
        </HStack>
        <HStack spacing={2} color="#697667" cursor="pointer" onClick={() => {}}>
          <DeleteIcon />
          <Text fontSize="15px" lineHeight="21px">
            {t('Limpar filtro')}
          </Text>
        </HStack>
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${couriers?.length ?? '0'} itens na lista`)}
        </Text>
        <CheckboxGroup
          colorScheme="green"
          value={filters}
          onChange={(value) => setFilters(value as string[])}
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <Checkbox iconColor="white" value="approved">
              {t('Ativos')}
            </Checkbox>
            <Checkbox iconColor="white" value="pending">
              {t('Pendentes')}
            </Checkbox>
            <Checkbox iconColor="white" value="enabled">
              {t('Live')}
            </Checkbox>
          </HStack>
        </CheckboxGroup>
      </HStack>
      <CouriersTable couriers={couriers} />
      <Switch>
        <Route path={`${path}/:courierId`}>
          <BusinessDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default CouriersPage;
