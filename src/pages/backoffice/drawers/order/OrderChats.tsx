import {
  Box,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { OrderChatTypeGroup } from 'app/api/chat/types';
import { getChatTypeLabel } from 'app/api/chat/utils';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface OrderChatsProps {
  groups: OrderChatTypeGroup[];
  activeChat(): void;
}

export const OrderChats = ({ groups, activeChat }: OrderChatsProps) => {
  // side effects
  React.useEffect(() => {
    activeChat();
  }, [activeChat]);
  // UI
  return (
    <Box>
      <SectionTitle mt="0">{t('Chats iniciados:')}</SectionTitle>
      <Box overflowX="auto">
        <Table mt="4" size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th fontSize="11px">{t('Tipo')}</Th>
              <Th fontSize="11px">{t('Última msg.')}</Th>
              <Th fontSize="11px">{t('Status.')}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {groups.map((group) => (
              <Tr key={group.type} color="black" fontSize="sm">
                <Td fontSize="13px" fontWeight="700">
                  {getChatTypeLabel(group.type)}
                </Td>
                <Td fontSize="13px">{getDateAndHour(group.lastUpdate)}</Td>
                <Td fontSize="13px" textAlign="center">
                  {group.unreadMessages ? (
                    <Icon mt="-2px" viewBox="0 0 200 200" color={'orange.400'}>
                      <path
                        fill="currentColor"
                        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                      />
                    </Icon>
                  ) : (
                    <Icon mt="-2px" viewBox="0 0 200 200" color={'green.500'}>
                      <path
                        fill="currentColor"
                        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                      />
                    </Icon>
                  )}
                </Td>
                <Td>
                  <CustomButton
                    variant="outline"
                    size="sm"
                    link={`/backoffice/chat/${group.orderId}/${group.type}`}
                    label={t('Ver chat')}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <HStack mt="8" fontSize="13px">
          <Text>{t('Legenda:')}</Text>
          <HStack>
            <Text>{t('Msgs. lidas')}</Text>
            <Icon mt="-2px" viewBox="0 0 200 200" color={'green.500'}>
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          </HStack>
          <HStack>
            <Text>{t('Msgs. não lidas')}</Text>
            <Icon mt="-2px" viewBox="0 0 200 200" color={'orange.400'}>
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};
