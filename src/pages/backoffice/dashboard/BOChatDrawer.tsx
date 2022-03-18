import { ChatMessageType, Flavor } from '@appjusto/types';
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
import restaurantIcon from 'common/img/restaurant.svg';
import { FieldValue } from 'firebase/firestore';
import { ChatMessages } from 'pages/chat/ChatMessages';
import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
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
  const [lastUpdate, setLastUpdate] = React.useState<FieldValue>();
  // refs
  const messagesBox = React.useRef<HTMLDivElement>(null);
  //handlers
  const getNameToDisplay = (flavor: Flavor, name?: string) => {
    let ptFlavor = '(Rest.)';
    if (flavor === 'consumer') ptFlavor = '(Consum.)';
    else if (flavor === 'courier') ptFlavor = '(Entreg.)';
    return `${ptFlavor} ${name ?? 'N/E'}`;
  };
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
                  <Link to={`/backoffice/order/${orderId}/chats`}>
                    <Text
                      as="span"
                      color="gray.600"
                      fontWeight="500"
                      _hover={{ textDecor: 'underline' }}
                    >
                      {orderId ?? 'N/E'}
                    </Text>
                  </Link>
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
                  name={getNameToDisplay(group.from.agent, group.from.name)}
                  messages={group.messages}
                />
              ))}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
