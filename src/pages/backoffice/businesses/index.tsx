import { DeleteIcon } from '@chakra-ui/icons';
import { Checkbox, CheckboxGroup, Flex, HStack, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { useBusinessesContext } from '../context/BusinessesContext';
import { BusinessDrawer } from '../drawers/business';
import { BusinessesTable } from './BusinessesTable';
import { FilterText } from './FilterText';

const BusinessesPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { businesses } = useBusinessesContext();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [searchName, setSearchName] = React.useState('');
  const [searchManager, setSearchManager] = React.useState('');

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
      <PageHeader title={t('Restaurantes')} subtitle={t(`Atualizado ${dateTime}`)} />
      <HStack mt="8" spacing={4}>
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
          id="search-name"
          value={searchName}
          onChange={(event) => setSearchName(event.target.value)}
          label={t('Nome')}
          placeholder={t('Nome do restaurante')}
        />
        <CustomInput
          mt="0"
          id="search-manager"
          value={searchManager}
          onChange={(event) => setSearchManager(event.target.value)}
          label={t('Administrador')}
          placeholder={t('Nome do responsável')}
        />
        <CustomButton maxW="200px" label={t('Filtrar resultados')} />
      </HStack>
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <HStack spacing={4}>
          <FilterText
            isActive={filterText === 'all' ? true : false}
            onClick={() => handleFilterTexts('all')}
          >
            {t('Todos')}
          </FilterText>
          <FilterText
            isActive={filterText === 'submitted' ? true : false}
            onClick={() => handleFilterTexts('submitted')}
          >
            {t('Aguardando aprovação')}
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
          {t(`${businesses?.length ?? '0'} itens na lista`)}
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
              {t('Publicados')}
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
      <BusinessesTable businesses={businesses} />
      <Switch>
        <Route path={`${path}/:businessId`}>
          <BusinessDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default BusinessesPage;
