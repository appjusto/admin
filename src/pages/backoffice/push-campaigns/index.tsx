import { PushCampaign } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useObservePushCampaigns } from 'app/api/push-campaigns/useObservePushCampaigns';
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
import { PushDrawer } from '../drawers/push';
import { PushCampaignTable } from './PushCampaignTable';

const PushCampaignPage = () => {
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [searchName, setSearchName] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');
  const [filterBar, setFilterBar] = React.useState<PushCampaign['status']>();
  const [clearDateNumber, setClearDateNumber] = React.useState(0);
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { campaigns, fetchNextPage } = useObservePushCampaigns(
    searchName,
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
    setSearchName('');
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
        title={t('Campanhas de notificações')}
        subtitle={t(`Atualizado ${dateTime}`)}
      />
      <Flex mt="8">
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
          <CustomInput
            mt="0"
            minW="230px"
            id="search-id"
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
            label={t('Nome')}
            placeholder={t('Digite o nome da campanha')}
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
              isActive={filterBar === 'submitted'}
              label={t('Submetida')}
              onClick={() => setFilterBar('submitted')}
            />
            <FilterText
              isActive={filterBar === 'approved'}
              label={t('Aprovada')}
              onClick={() => setFilterBar('approved')}
            />
            <FilterText
              isActive={filterBar === 'rejected'}
              label={t('Rejeitada')}
              onClick={() => setFilterBar('rejected')}
            />
          </HStack>
        </FiltersScrollBar>
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <Flex mt="6" color="black" justifyContent="space-between">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${campaigns?.length ?? '0'} itens na lista`)}
        </Text>
        <CustomButton mt="0" label={t('Criar campanha')} link={`${path}/new`} />
      </Flex>
      <PushCampaignTable campaigns={campaigns} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:campaignId`}>
          <PushDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default PushCampaignPage;
