import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useObserveOrderChatByType } from 'app/api/chat/useObserveOrderChatByType';
import { getChatLastUpdate, getChatTypeLabel } from 'app/api/chat/utils';
import { Flavor } from 'appjusto-types';
import { ChatMessageType } from 'appjusto-types/order/chat';
import restaurantIcon from 'common/img/restaurant.svg';
import firebase from 'firebase/app';
import { ChatMessages } from 'pages/chat/ChatMessages';
import React from 'react';
import { useParams } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  orderId: string;
  type: ChatMessageType;
};

export const BOChatDrawer = ({ onClose, ...props }: ChatDrawerProps) => {
  //context
  const { orderId, type } = useParams<Params>();
  const { chat } = useObserveOrderChatByType(orderId, type);
  // state
  const [lastUpdate, setLastUpdate] = React.useState<firebase.firestore.FieldValue>();
  // refs
  const messagesBox = React.useRef<HTMLDivElement>(null);
  //handlers
  const getImage = (flavor: Flavor) => {
    if (flavor === 'business') return restaurantIcon;
    else return null;
  };
  // side effects
  React.useEffect(() => {
    if (chat.length === 0) return;
    if (chat && messagesBox.current) {
      messagesBox.current.scroll({ top: messagesBox.current.scrollHeight, behavior: 'smooth' });
    }
    setLastUpdate(getChatLastUpdate(chat));
  }, [chat]);
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="4">
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Flex flexDir="column">
                <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
                  {t('Tipo de chat: ')}
                  {getChatTypeLabel(type)}
                </Text>
                <Text mt="2" fontSize="md" color="black" fontWeight="700" lineHeight="22px">
                  {t('ID do pedido:')}{' '}
                  <Text as="span" color="gray.600" fontWeight="500">
                    {orderId ?? 'N/E'}
                  </Text>
                </Text>
                <Text fontSize="md" color="black" fontWeight="700" lineHeight="22px">
                  {t('Atualizado em:')}{' '}
                  <Text as="span" color="gray.600" fontWeight="500">
                    {getDateAndHour(lastUpdate)}
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerBody bg="gray.50" ref={messagesBox}>
            {chat.length > 0 &&
              chat.map((group) => (
                <ChatMessages
                  key={group.id}
                  image={getImage(group.from.agent)}
                  name={group.from.name ?? 'N/E'}
                  messages={group.messages}
                />
              ))}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};