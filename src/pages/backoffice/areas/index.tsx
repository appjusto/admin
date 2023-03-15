import { ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
//import Checkbox from 'common/components/form/Checkbox';
import { useObserveAreas } from 'app/api/areas/useObserveAreas';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { CreateUserDrawer } from '../drawers/user/CreateUserDrawer';
import { UserBaseDrawer } from '../drawers/user/UserBaseDrawer';
import { AreasTable } from './AreasTable';

const AreasPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { userAbility } = useContextFirebaseUser();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const { areas, fetchNextPage } = useObserveAreas(state, city);
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  const clearFilters = () => {
    setState('');
    setCity('');
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
        title={t('Áreas de atuação')}
        subtitle={t(`Atualizado ${dateTime}`)}
      />
      <Flex mt="2">
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
          <CustomInput
            mt="0"
            minW={{ lg: '260px' }}
            id="search-id"
            value={state}
            onChange={(event) => setState(event.target.value)}
            label={t('Estado')}
            placeholder={t('Escolha o estado')}
          />
          <CustomInput
            mt="0"
            minW={{ lg: '260px' }}
            id="search-id"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            label={t('Cidade')}
            placeholder={t('Escolha a cidade')}
          />
        </Stack>
      </Flex>
      <Flex
        mt="8"
        w="100%"
        pb="2"
        justifyContent="space-between"
        borderBottom="1px solid #C8D7CB"
      >
        <HStack spacing={4} overflowX="auto">
          {/* <FilterText
            isActive={!isBlocked}
            label={t('Todos')}
            onClick={() => setIsBlocked(false)}
          />
          <FilterText
            isActive={isBlocked}
            label={t('Bloqueados')}
            onClick={() => setIsBlocked(true)}
          /> */}
        </HStack>
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <Flex mt="6" flexDir="row" justifyContent="space-between" color="black">
        <HStack spacing={8}>
          <Text fontSize="lg" fontWeight="700" lineHeight="26px">
            {t(`${areas?.length ?? '0'} áreas listadas`)}
          </Text>
          {/*<CheckboxGroup
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
              <Checkbox value="manager">{t('Manager')}</Checkbox>
              <Checkbox value="courier">{t('Entregador')}</Checkbox>
              <Checkbox value="consumer">{t('Consumidor')}</Checkbox>
            </HStack>
          </CheckboxGroup>*/}
        </HStack>
        {userAbility?.can('create', 'areas') && (
          <CustomButton mt="0" label={t('Criar área')} link={`${path}/new`} />
        )}
      </Flex>
      <AreasTable areas={areas} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route exact path={`${path}/new`}>
          <CreateUserDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/:userId`}>
          <UserBaseDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default AreasPage;
