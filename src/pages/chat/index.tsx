import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { OrderChatGroup } from 'app/api/business/chat/useBusinessChats';
import { timestampToDate } from 'app/api/chat/utils';
import Container from 'common/components/Container';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import { useOrdersContext } from 'pages/orders/context';
import { OrdersHeader } from 'pages/orders/OrdersHeader';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { ChatDrawer } from './ChatDrawer';
import { ChatsTable } from './ChatsTable';

export const ChatPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { orders, chats } = useOrdersContext();

  // state
  const [search, setSearch] = React.useState('');
  const [dateTime, setDateTime] = React.useState('');
  const [orderedChats, setOrderedChats] = React.useState<OrderChatGroup[]>([]);
  const [searchResult, setSearchResult] = React.useState<OrderChatGroup[]>([]);

  // handlers
  const closeDrawerHandler = () => history.replace(path);

  // side effects
  React.useEffect(() => {
    if (!chats || !orders) return;
    const fullChats = chats.map((chat) => {
      const order = orders.find((order) => order.id === chat.orderId);
      const orderCode = order?.code ?? 'N/E';
      let lastUpdate = order?.createdOn as firebase.firestore.FieldValue;
      const counterpartName = (counterpartId: string) => {
        const isCourier = order?.courier?.id === counterpartId;
        let name = 'N/E';
        if (isCourier) name = order?.courier?.name!;
        else name = order?.consumer.name!;
        return name;
      };
      const newCounterPart = chat.counterParts.map((part) => {
        if (part.updatedOn > lastUpdate) lastUpdate = part.updatedOn;
        return { ...part, name: counterpartName(part.id) };
      });
      const newChat = {
        ...chat,
        counterParts: newCounterPart,
        orderCode,
        lastUpdate,
      } as OrderChatGroup;
      return newChat;
    });

    const sortMessages = (a: OrderChatGroup, b: OrderChatGroup) => {
      if (a.lastUpdate && b.lastUpdate)
        return timestampToDate(b.lastUpdate).getTime() - timestampToDate(a.lastUpdate).getTime();
      if (!a.lastUpdate) return 1;
      else if (!b.lastUpdate) return -1;
      return 0;
    };

    const ordered = fullChats.sort(sortMessages);
    setOrderedChats(ordered);
  }, [orders, chats, setOrderedChats]);

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  React.useEffect(() => {
    if (search) {
      const regexp = new RegExp(search, 'i');
      const result = orderedChats.filter((chat) => regexp.test(chat.orderCode as string));
      setSearchResult(result);
    }
  }, [orderedChats, search]);

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
        <ChatsTable chats={search ? searchResult : orderedChats} />
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
