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
  HStack,
  Image,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useOrderChat } from 'app/api/order/useOrderChat';
import { Flavor } from 'appjusto-types';
import managerIcon from 'common/img/manager.svg';
import React, { KeyboardEvent } from 'react';
import { useParams } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ChatMessage {
  id: string;
  from: {
    agent: Flavor;
    name: string;
    id: string;
  };
  to: {
    agent: Flavor;
    name: string;
    id: string;
  };
  message: string;
  //timestamp: firebase.firestore.Timestamp;
  timestamp: string;
}

const fakeMessages = [
  {
    id: 'skjcaskcna',
    from: {
      agent: 'Entregador',
      name: 'Kelly Slater',
      id: '001',
    },
    to: {
      agent: 'Restaurante',
      name: 'Itapuama Vegan',
      id: '002',
    },
    message: 'Já cheguei!',
    timestamp: '12h45',
  },
  {
    id: 'skjohhtphtplhp',
    from: {
      agent: 'Restaurante',
      name: 'Itapuama Vegan',
      id: '002',
    },
    to: {
      agent: 'Entregador',
      name: 'Kelly Slater',
      id: '001',
    },
    message: 'Ok!',
    timestamp: '12h55',
  },
  {
    id: 'skjc3216898',
    from: {
      agent: 'Restaurante',
      name: 'Itapuama Vegan',
      id: '002',
    },
    to: {
      agent: 'Entregador',
      name: 'Kelly Slater',
      id: '001',
    },
    message: 'O pedido está pronto!',
    timestamp: '12h56',
  },
];

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
  const { orderId, counterpartId } = useParams<Params>();
  const { names, counterpartFlavor, groupMessages, sendMessage, sendMessageResult } = useOrderChat(
    orderId,
    counterpartId
  );
  const { isLoading, isError } = sendMessageResult;
  console.log(groupMessages);
  // state
  const [inputText, setInputText] = React.useState('');

  // refs
  const messagesBox = React.useRef(null);

  //handlers
  const getName = (id?: string) => {
    if (!id) return 'N/E';
    //@ts-ignore
    return names[id] ?? 'N/E';
  };

  const getTime = (timestamp: firebase.firestore.Timestamp) => {
    const fullDate = getDateAndHour(timestamp);
    const time = fullDate.split(' ')[1];
    return time;
  };

  const sendMessageHandler = () => {
    if (!inputText) return;
    if (!counterpartId || !counterpartFlavor) return;
    const to: { agent: Flavor; id: string } = {
      agent: counterpartFlavor,
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
      sendMessageHandler();
    }
  };

  // side effects
  React.useEffect(() => {
    if (messagesBox?.current) {
      //@ts-ignore
      messagesBox.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, []);

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
                  {t('ID:')}{' '}
                  <Text as="span" color="gray.600" fontWeight="500">
                    {'000'}
                  </Text>
                </Text>
                <Text fontSize="md" color="black" fontWeight="700" lineHeight="22px">
                  {t('Atualizado em:')}{' '}
                  <Text as="span" color="gray.600" fontWeight="500">
                    {'00/00/0000 - 00:00'}
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerBody bg="gray.50" ref={messagesBox}>
            {groupMessages.length > 0 &&
              groupMessages.map((message, index) => (
                <Box key={message.id} my="4">
                  <HStack>
                    <Flex
                      p="2"
                      justifyContent="center"
                      alignItems="center"
                      border="1px solid #000"
                      borderRadius="20px"
                    >
                      <Image src={managerIcon} width="24px" height="24px" />
                    </Flex>
                    <Box>
                      <Text fontSize="15px" lineHeight="21px" fontWeight="500" color="black">
                        {getName(message.from.id)}
                      </Text>
                      <Text fontSize="13px" lineHeight="18px" fontWeight="500">
                        {getTime(message.timestamp)}
                      </Text>
                    </Box>
                  </HStack>
                  <Box
                    mt="2"
                    w="fit-content"
                    py="2"
                    px="4"
                    bg="white"
                    border="1px solid #C8D7CB"
                    borderRadius="lg"
                  >
                    <Text>{message.message}</Text>
                  </Box>
                </Box>
              ))}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #C8D7CB">
            <Box w="100%" position="relative">
              <Textarea
                w="100%"
                h="72px"
                border="1px solid #C8D7CB"
                borderRadius="md"
                pl="2"
                pr="8rem"
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
              />
              <Button
                position="absolute"
                top="4"
                right="4"
                onClick={sendMessageHandler}
                isLoading={isLoading}
                loadingText={t('Enviando...')}
                zIndex="9999"
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
