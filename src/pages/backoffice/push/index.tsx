import { ArrowDownIcon } from '@chakra-ui/icons';
import { Button, Flex, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { PushDrawer } from '../drawers/push';

const PushPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [pushList, setPushList] = React.useState([]);
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  // UI
  return (
    <>
      <PageHeader title={t('Notificações')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="8">
        <CustomInput
          mt="0"
          minW={{ lg: '260px' }}
          maxW="400px"
          id="search-id"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          label={t('Busca')}
          placeholder={t('Digite sua busca')}
        />
      </Flex>
      <Flex
        mt="4"
        w="100%"
        pb={{ lg: '2' }}
        justifyContent="flex-end"
        borderBottom="1px solid #C8D7CB"
      ></Flex>
      <Flex
        mt="4"
        flexDir={{ base: 'column', md: 'row' }}
        justifyContent={{ md: 'space-between' }}
        color="black"
      >
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${pushList ? pushList?.length : '0'} notificações encontradas`)}
        </Text>
        <CustomButton mt="0" label={t('Criar notificação')} link={`${path}/new`} />
      </Flex>
      {/* <StaffsTable staffs={[]} /> */}
      <Button mt="8" variant="secondary" onClick={() => {}}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:pushId`}>
          <PushDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default PushPage;
