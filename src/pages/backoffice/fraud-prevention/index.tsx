import { ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
//import { useFlaggedLocations } from 'app/api/platform/useFlaggedLocations';
import { useFlaggedlocationsSearch } from 'app/api/search/useFlaggedlocationsSearch';
import { FlaggedLocationsAlgolia } from 'appjusto-types';
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

  //const { flaggedLocations } = useFlaggedLocations();

  const {
    results: flaggedLocations,
    fetchNextPage,
    refetch,
  } = useFlaggedlocationsSearch<FlaggedLocationsAlgolia>(true, 'flaggedlocations', filters, search);

  // handlers
  //const closeDrawerHandler = () => {
  //  history.replace(path);
  //};

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

  // UI
  return (
    <>
      <PageHeader title={t('Antifraude')} subtitle={t(`Atualizado ${dateTime}`)} />
      <SectionTitle>{t('Endereços suspeitos de fraude')}</SectionTitle>
      <Flex mt="6">
        <HStack spacing={4}>
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
        </HStack>
      </Flex>
      <Flex mt="6" w="100%" justifyContent="flex-end" borderBottom="1px solid #C8D7CB">
        <HStack spacing={2} color="#697667" cursor="pointer" onClick={clearFilters} pb="2">
          <DeleteIcon />
          <Text fontSize="15px" lineHeight="21px">
            {t('Limpar filtro')}
          </Text>
        </HStack>
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${flaggedLocations?.length ?? '0'} endereços encontrados`)}
        </Text>
      </HStack>
      <FlaggedLocationsTable locations={flaggedLocations} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
    </>
  );
};

export default FraudPreventionPage;
