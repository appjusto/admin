import { ChatMessage, ChatMessageType, Flavor } from '@appjusto/types';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
// import { Participants, useOrderChat } from 'app/api/order/useOrderChat';
import { useObserveBusinessOrderChatByType } from 'app/api/chat/useObserveBusinessOrderChatByType';
// import { useUpdateChatMessage } from 'app/api/business/chat/useUpdateChatMessage';
import { useUpdateChatMessage } from 'app/api/chat/useUpdateChatMessage';
import { getUnreadChatMessages } from 'app/api/chat/utils';
import { useContextBusiness } from 'app/state/business/context';
import { useContextServerTime } from 'app/state/server-time';
import { useContextStaffProfile } from 'app/state/staff/context';
import React, { KeyboardEvent } from 'react';
import { useParams } from 'react-router';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import ChatMessages from './ChatMessages';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  orderId: string;
  counterpartId: string;
};

type CurrentCounterPart = {
  name: string;
  flavor?: Flavor;
  flavorLabel: string;
};

export const ChatDrawer = ({ onClose, ...props }: ChatDrawerProps) => {
  //context
  const { getServerTime } = useContextServerTime();
  const { isBackofficeUser } = useContextStaffProfile();
  const { logo } = useContextBusiness();
  const { orderId, counterpartId } = useParams<Params>();
  const { updateChatMessage } = useUpdateChatMessage();
  const {
    isActive,
    orderCode,
    participants,
    chat,
    sendMessage,
    sendMessageResult,
  } = useObserveBusinessOrderChatByType(getServerTime, orderId, counterpartId);
  const toast = useToast();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [currentCounterPart, setCurrentCounterPart] =
    React.useState<CurrentCounterPart>();
  const [inputText, setInputText] = React.useState('');
  // refs
  const messagesBox = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  //handlers
  const getImage = (id?: string) => {
    if (!id) return null;
    const participant = participants.find(
      (participant) => participant.id === id
    );
    if (participant?.flavor === 'business') return logo;
    const image = participant?.image;
    return image ?? null;
  };
  const sendMessageHandler = () => {
    if (!inputText) return;
    if (!counterpartId) return;
    if (!currentCounterPart?.flavor) return;
    if (!isActive) {
      return toast({
        title: 'Não é possível enviar a mensagem.',
        description: 'Este pedido não está mais ativo.',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
    }
    const flavor = currentCounterPart.flavor;
    const type = `business-${flavor}` as ChatMessageType;
    const to: { agent: Flavor; id: string; name: string } = {
      agent: flavor,
      id: counterpartId,
      name: currentCounterPart.name,
    };
    sendMessage({
      type,
      to,
      message: inputText.trim(),
    });
    setInputText('');
  };
  const handleUserKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessageHandler();
    }
  };
  // side effects
  React.useEffect(() => {
    inputRef?.current?.focus();
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
    if (chat) {
      const unreadMessagesIds = getUnreadChatMessages(chat, counterpartId);
      if (unreadMessagesIds.length > 0) {
        unreadMessagesIds.forEach((messageId) => {
          updateChatMessage({
            messageId,
            changes: { read: true } as Partial<ChatMessage>,
          });
        });
      }
    }
    if (messagesBox.current) {
      messagesBox.current.scroll({
        top: messagesBox.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chat, orderId, counterpartId, updateChatMessage]);
  React.useEffect(() => {
    if (!participants || !counterpartId) return;
    const current = participants.find(
      (participant) => participant.id === counterpartId
    );
    const getFlavorLabel = (flavor?: Flavor) => {
      if (flavor === 'consumer') return 'cliente';
      else if (flavor === 'courier') return 'entregador';
      else return 'N/E';
    };
    setCurrentCounterPart({
      name: current?.name ?? 'N/E',
      flavor: current?.flavor,
      flavorLabel: getFlavorLabel(current?.flavor),
    });
  }, [participants, counterpartId]);
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent pt={isBackofficeUser ? '16' : 0}>
          <DrawerCloseButton
            bg="green.500"
            mr="12px"
            _focus={{ outline: 'none' }}
          />
          <DrawerHeader pb="4">
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Flex flexDir="column">
                <Text
                  color="black"
                  fontSize="2xl"
                  fontWeight="700"
                  lineHeight="28px"
                  mb="2"
                >
                  {t('Chat com ')}{' '}
                  {`${currentCounterPart?.flavorLabel} {${currentCounterPart?.name}}`}
                </Text>
                <Text
                  fontSize="md"
                  color="black"
                  fontWeight="700"
                  lineHeight="22px"
                >
                  {t('ID do pedido:')}{' '}
                  <Text as="span" color="gray.600" fontWeight="500">
                    {orderCode ?? 'N/E'}
                  </Text>
                </Text>
                <Text
                  fontSize="md"
                  color="black"
                  fontWeight="700"
                  lineHeight="22px"
                >
                  {t('Atualizado em:')}{' '}
                  <Text as="span" color="gray.600" fontWeight="500">
                    {dateTime}
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
                  image={getImage(group.from.id)}
                  name={group.from.name ?? 'N/E'}
                  messages={group.messages}
                />
              ))}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #C8D7CB">
            <Box w="100%" position="relative">
              <Textarea
                ref={inputRef}
                w="100%"
                h="72px"
                border="1px solid #C8D7CB"
                borderRadius="md"
                pl="2"
                pr="11rem"
                pt="1"
                pb="1"
                size="sm"
                color="#697667"
                fontFamily="barlow"
                placeholder={t('Escreva sua mensagem')}
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                zIndex="9000"
                onKeyPress={handleUserKeyPress}
                isDisabled={!isActive}
              />
              <Button
                position="absolute"
                top="4"
                right="16"
                onClick={sendMessageHandler}
                isLoading={sendMessageResult.isLoading}
                loadingText={t('Enviando...')}
                zIndex="9999"
                isDisabled={!isActive}
              >
                {t('Enviar')}
              </Button>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
