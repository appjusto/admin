import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { OrderChatGroup } from 'app/api/chat/types';
import { useOrdersContext } from 'app/state/order';
import Container from 'common/components/Container';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import { OrdersHeader } from 'pages/orders/OrdersHeader';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { ChatDrawer } from './ChatDrawer';
import { ChatsTable } from './ChatsTable';

export const ChatPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { activeChat, chats } = useOrdersContext();
  console.log('Chats', chats);
  // state
  const [search, setSearch] = React.useState('');
  const [dateTime, setDateTime] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<OrderChatGroup[]>([]);
  // handlers
  const closeDrawerHandler = () => history.replace(path);
  // side effects
  React.useEffect(() => {
    if (activeChat) activeChat();
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, [activeChat]);
  React.useEffect(() => {
    if (search) {
      const regexp = new RegExp(search, 'i');
      const result = chats.filter((chat) =>
        regexp.test(chat.orderCode as string)
      );
      setSearchResult(result);
    }
  }, [chats, search]);
  // UI
  return (
    // ChatContext
    <Box>
      <OrdersHeader />
      <Container maxW={{ base: '100%', md: '740px', lg: '1260px' }} pb="32">
        <Box>
          <Box>
            <Link to="/app/orders">
              <Button variant="outline" fontSize="sm" lineHeight="21px">
                <ArrowBackIcon w="16px" h="16px" mr="2" mb="-2px" />
                {t('Voltar para gerenciador de pedidos')}
              </Button>
            </Link>
          </Box>
          <Flex
            mt="8"
            flexDir={{ base: 'column', lg: 'row' }}
            justifyContent="space-between"
            alignItems={{ lg: 'flex-end' }}
          >
            <PageHeader
              title={t('Chat')}
              subtitle={t(`Dados atualizados em ${dateTime}`)}
            />
            <InputGroup maxW="360px">
              <Input
                mt={{ base: '4', lg: '0' }}
                minW={{ lg: '340px' }}
                height="60px"
                borderColor="black"
                _hover={{ borderColor: 'black' }}
                value={search}
                placeholder={t('Pesquisar por ID do pedido')}
                onChange={(ev) => setSearch(ev.target.value)}
              />
              <InputRightElement
                mt={{ base: '26px', lg: '10px' }}
                mr="8px"
                children={<Icon w="22px" h="22px" as={SearchIcon} />}
              />
            </InputGroup>
          </Flex>
        </Box>
        <ChatsTable chats={search ? searchResult : chats} />
      </Container>
      <Switch>
        <Route path={`${path}/:orderId/:counterpartId`}>
          <ChatDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default ChatPage;
