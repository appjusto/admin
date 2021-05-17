import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import { OrdersHeader } from 'pages/orders/OrdersHeader';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { ChatDrawer } from './ChatDrawer';
import { ChatsTable } from './ChatsTable';

const fakeChats = [{ id: '001' }, { id: '002' }, { id: '003' }];

const ChatPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();

  // state
  const [search, setSearch] = React.useState('');
  const [dateTime, setDateTime] = React.useState('');

  // handlers
  const closeDrawerHandler = () => history.replace(path);

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  // UI
  return (
    // ChatContext
    <Box>
      <OrdersHeader statusEnabled={false} />
      <Container maxW={{ base: '100%', md: '740px', lg: '1260px' }}>
        <Box>
          <Box>
            <Link to="/app/orders">
              <Button variant="outline" fontSize="sm" lineHeight="21px">
                <ArrowBackIcon w="16px" h="16px" mr="2" mb="-2px" />
                {t('Voltar para gerenciador de pedidos')}
              </Button>
            </Link>
          </Box>
          <Flex mt="8" justifyContent="space-between" alignItems="flex-end">
            <PageHeader title={t('Chat')} subtitle={t(`Dados atualizados em ${dateTime}`)} />
            <InputGroup maxW="360px">
              <Input
                minW="340px"
                height="60px"
                borderColor="black"
                _hover={{ borderColor: 'black' }}
                value={search}
                placeholder={t('Pesquisar por chat (ID ou Nome)')}
                onChange={(ev) => setSearch(ev.target.value)}
              />
              <InputRightElement
                mt="10px"
                mr="8px"
                children={<Icon w="22px" h="22px" as={SearchIcon} />}
              />
            </InputGroup>
          </Flex>
        </Box>
        <ChatsTable chats={fakeChats} />
      </Container>
      <Switch>
        <Route path={`${path}/:orderId/:participantId`}>
          <ChatDrawer isOpen chatId={'000'} onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default ChatPage;
