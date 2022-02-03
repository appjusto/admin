import { ArrowDownIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
//import { useFlaggedLocations } from 'app/api/platform/useFlaggedLocations';
import { useFlaggedlocationsSearch } from 'app/api/search/useFlaggedlocationsSearch';
import { FlaggedLocationsAlgolia } from 'appjusto-types';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { SearchButton } from 'common/components/backoffice/SearchButton';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import { CustomInput } from 'common/components/form/input/CustomInput';
import dayjs from 'dayjs';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { SectionTitle } from '../drawers/generics/SectionTitle';
import { FlaggedLocationsTable } from './FlaggedLocationsTable';

const FraudPreventionPage = () => {
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');
  const [filters, setFilters] = React.useState<number[]>();
  const [clearDateNumber, setClearDateNumber] = React.useState(0);
  const [isSeachEnabled, setIsSeachEnabled] = React.useState(false);

  //const { flaggedLocations } = useFlaggedLocations();
  const {
    results: flaggedLocations,
    fetchNextPage,
    refetch,
  } = useFlaggedlocationsSearch<FlaggedLocationsAlgolia>(
    isSeachEnabled,
    'flaggedlocations',
    filters,
    search
  );

  // handlers
  //const closeDrawerHandler = () => {
  //  history.replace(path);
  //};

  const handleSearch = () => {
    if (search.length === 0 && !filters) return;
    console.log('Do Search!');
    setIsSeachEnabled(true);
  };

  const handleDataLoad = () => {
    if (flaggedLocations) fetchNextPage();
    else setIsSeachEnabled(true);
  };

  const clearFilters = () => {
    setClearDateNumber((prev) => prev + 1);
    setSearch('');
    setSearchFrom('');
    setSearchTo('');
    refetch();
  };

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  React.useEffect(() => {
    if (!searchFrom || !searchTo) return;
    let startDate = dayjs(searchFrom).startOf('day').toDate().getTime();
    let endDate = dayjs(searchTo).endOf('day').toDate().getTime();
    setFilters([startDate, endDate]);
  }, [searchFrom, searchTo]);

  React.useEffect(() => {
    setIsSeachEnabled(false);
  }, [flaggedLocations]);

  // UI
  return (
    <>
      <PageHeader title={t('Antifraude')} subtitle={t(`Atualizado ${dateTime}`)} />
      <SectionTitle>{t('Endereços suspeitos de fraude')}</SectionTitle>
      <Flex mt="6">
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
          <CustomInput
            mt="0"
            minW={{ lg: '400px' }}
            id="search-id"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            label={t('Busca')}
            placeholder={t('Digite o endereço')}
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
        mt="6"
        w="100%"
        pb={{ lg: '2' }}
        justifyContent="flex-end"
        borderBottom="1px solid #C8D7CB"
      >
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${flaggedLocations?.length ?? '0'} endereços encontrados`)}
        </Text>
      </HStack>
      <FlaggedLocationsTable locations={flaggedLocations} refetch={refetch} />
      <Button mt="8" variant="secondary" onClick={handleDataLoad}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
    </>
  );
};

export default FraudPreventionPage;
