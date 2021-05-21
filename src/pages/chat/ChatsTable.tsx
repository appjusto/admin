import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { OrderChatGroup } from 'app/api/business/chat/useBusinessChats';
import { timestampToDate } from 'app/api/chat/utils';
import { useOrdersContext } from 'pages/orders/context';
import React from 'react';
import { t } from 'utils/i18n';
import { ChatsTableItem } from './ChatsTableItem';

interface ChatTableProps {
  chats: OrderChatGroup[] | undefined;
}

export const ChatsTable = ({ chats }: ChatTableProps) => {
  // context
  const { orders } = useOrdersContext();

  // state
  const [orderedChats, setOrderedChats] = React.useState<OrderChatGroup[]>([]);

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
      if (!a.lastUpdate) return -1;
      else if (b.lastUpdate) return 1;
      return 0;
    };

    const ordered = fullChats.sort(sortMessages);
    console.log(ordered);
    setOrderedChats(ordered);
  }, [orders, chats, setOrderedChats]);

  // UI
  return (
    <Box mt="12">
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('Pedido')}</Th>
            <Th>{t('Última atualização')}</Th>
            <Th>{t('Participante')}</Th>
            <Th>{t('Nome')}</Th>
            <Th>{t('Nova mensagem')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {orderedChats.length > 0 ? (
            orderedChats.map((chat) => {
              return <ChatsTableItem key={chat.orderId} chat={chat} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não há chats abertos no momento')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
