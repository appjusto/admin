import { DeleteIcon } from '@chakra-ui/icons';
import { Flex, HStack, Text } from '@chakra-ui/react';
import { ConsumerProfile, WithId } from 'appjusto-types';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BusinessDrawer } from '../drawers/business';
import { ConsumersTable } from './ConsumersTable';

const CouriersPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const consumers = [] as WithId<ConsumerProfile>[];
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [searchName, setSearchName] = React.useState('');

  const [filterText, setFilterText] = React.useState('all');

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
      <PageHeader title={t('Clientes')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="8" justifyContent="space-between">
        <HStack spacing={4}>
          <CustomInput
            mt="0"
            maxW="212px"
            id="search-id"
            value={searchId}
            onChange={(event) => setSearchId(event.target.value)}
            label={t('ID')}
            placeholder={t('000')}
          />
          <CustomInput
            mt="0"
            w="280px"
            id="search-name"
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
            label={t('Nome')}
            placeholder={t('Nome do restaurante')}
          />
        </HStack>
        <CustomButton mt="0" maxW="200px" label={t('Filtrar resultados')} />
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
          {t(`${consumers?.length ?? '0'} itens na lista`)}
        </Text>
      </HStack>
      <ConsumersTable consumers={consumers} />
      <Switch>
        <Route path={`${path}/:consumerId`}>
          <BusinessDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default CouriersPage;
