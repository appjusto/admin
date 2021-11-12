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
import { useUpdateChatMessage } from 'app/api/business/chat/useUpdateChatMessage';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { getUnreadChatMessages } from 'app/api/chat/utils';
import { Participants, useOrderChat } from 'app/api/order/useOrderChat';
import { useContextServerTime } from 'app/state/server-time';
import { ChatMessage, Flavor } from 'appjusto-types';
import React, { KeyboardEvent } from 'react';
import { useParams } from 'react-router';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { ChatMessages } from './ChatMessages';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  orderId: string;
  counterpartId: string;
};

export const ChatDrawer = ({ onClose, ...props }: ChatDrawerProps) => {
  //context
  const { getServerTime } = useContextServerTime();
  const { logo } = useBusinessProfile();
  const { orderId, counterpartId } = useParams<Params>();
  const { updateChatMessage } = useUpdateChatMessage();
  const { isActive, orderCode, participants, chat, sendMessage, sendMessageResult } = useOrderChat(
    getServerTime,
    orderId,
    counterpartId
  );
  const toast = useToast();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [inputText, setInputText] = React.useState('');
  // refs
  const messagesBox = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  //handlers
  const getImage = <K extends keyof Participants>(id?: K) => {
    if (!id) return null;
    if (id === counterpartId) return participants[counterpartId]?.image;
    else return logo;
  };
  const getName = <K extends keyof Participants>(id?: K) => {
    if (!id) return 'N/E';
    const name = participants[id]?.name;
    return name ?? participants[counterpartId]?.flavor ?? 'N/E';
  };
  const sendMessageHandler = () => {
    if (!inputText) return;
    if (!counterpartId) return;
    if (!isActive) {
      return toast({
        title: 'Não é possível enviar a mensagem.',
        description: 'Este pedido não está mais ativo.',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
    }
    const flavor = participants[counterpartId].flavor as Flavor;
    const to: { agent: Flavor; id: string } = {
      agent: flavor,
      id: counterpartId,
    };
    sendMessage({
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
            orderId,
            messageId,
            changes: { read: true } as Partial<ChatMessage>,
          });
        });
      }
    }
    if (messagesBox.current) {
      messagesBox.current.scroll({ top: messagesBox.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chat, orderId, counterpartId, updateChatMessage]);
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
                  {t('Chat com ')} {`{${getName(counterpartId)}}`}
                </Text>
                <Text fontSize="md" color="black" fontWeight="700" lineHeight="22px">
                  {t('ID do pedido:')}{' '}
                  <Text as="span" color="gray.600" fontWeight="500">
                    {orderCode ?? 'N/E'}
                  </Text>
                </Text>
                <Text fontSize="md" color="black" fontWeight="700" lineHeight="22px">
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
                  image={getImage(group.from)}
                  name={getName(group.from)}
                  messages={group.messages}
                />
                /*chat.map((message, index) => (
                <ChatMessages
                  key={message.id}
                  image={getImage(message.from.id)}
                  name={getName(message.from.id)}
                  message={message.message}
                  timestamp={message.timestamp}
                  isGrouped={index > 1 && chat[index - 1].from.id === message.from.id}
                />*/
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
