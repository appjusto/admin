import { ArrowDownIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useObserveRecommendations } from 'app/api/consumer/useObserveRecommendations';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { SearchButton } from 'common/components/backoffice/SearchButton';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { RecommendationBaseDrawer } from '../drawers/recommendation/RecommendationBaseDrawer';
import { RecommendationsTable } from './RecommendationsTable';

const RecommendationsPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');
  const [isSeachEnabled, setIsSeachEnabled] = React.useState(false);

  const [clearDateNumber, setClearDateNumber] = React.useState(0);

  const { recommendations, fetchNextPage } = useObserveRecommendations(
    isSeachEnabled,
    search,
    searchFrom,
    searchTo
  );

  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };

  const handleSearch = () => {
    if (search.length === 0 && (!searchFrom || !searchTo)) return;
    setIsSeachEnabled(true);
  };

  const handleDataLoad = () => {
    if (recommendations.length > 0) fetchNextPage();
    else setIsSeachEnabled(true);
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
  React.useEffect(() => {
    setIsSeachEnabled(false);
  }, [recommendations]);
  // UI
  return (
    <>
      <PageHeader title={t('Indicações')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="8">
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
          <CustomInput
            mt="0"
            minW={{ lg: '260px' }}
            id="search-id"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            label={t('Busca')}
            placeholder={t('Digite o nome do rest.')}
          />
          <CustomDateFilter
            getStart={setSearchFrom}
            getEnd={setSearchTo}
            clearNumber={clearDateNumber}
          />
          <SearchButton onClick={handleSearch} />
        </Stack>
      </Flex>
      <Flex
        mt="8"
        w="100%"
        pb={{ lg: '2' }}
        justifyContent="flex-end"
        borderBottom="1px solid #C8D7CB"
      >
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${recommendations?.length ?? '0'} recomendações na lista`)}
        </Text>
      </HStack>
      <RecommendationsTable recommendations={recommendations} />
      <Button mt="8" variant="secondary" onClick={handleDataLoad}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:recommendationId`}>
          <RecommendationBaseDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default RecommendationsPage;
