import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { OrderChatGroup } from 'app/api/business/chat/useBusinessChats';
import React from 'react';
import { t } from 'utils/i18n';
import { ChatsTableItem } from './ChatsTableItem';

interface ChatTableProps {
  chats: OrderChatGroup[];
}

export const ChatsTable = ({ chats }: ChatTableProps) => {
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
          {chats.length > 0 ? (
            chats.map((chat) => {
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
