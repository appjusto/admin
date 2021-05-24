import { Box, Flex, HStack, Image, Text } from '@chakra-ui/react';
import { ChatMessage, WithId } from 'appjusto-types';
import managerIcon from 'common/img/manager.svg';
import { getDateAndHour } from 'utils/functions';

interface ChatMessagesProps {
  image: string;
  name: string;
  messages: WithId<ChatMessage>[];
}

export const ChatMessages = ({ image, name, messages }: ChatMessagesProps) => {
  // helpers
  const getTime = (timestamp: firebase.firestore.Timestamp) => {
    if (!timestamp) return;
    const fullDate = getDateAndHour(timestamp);
    const time = fullDate.split(' ')[1];
    return time;
  };

  // UI
  return (
    <Box mt="4" mb="2">
      <HStack>
        <Flex
          width="40px"
          height="40px"
          justifyContent="center"
          alignItems="center"
          border="1px solid #000"
          borderRadius="20px"
          overflow="hidden"
        >
          <Image src={image ?? managerIcon} width="100%" />
        </Flex>
        <Text fontSize="15px" lineHeight="21px" fontWeight="500" color="black">
          {name}
        </Text>
      </HStack>
      {messages.map((message) => (
        <Box
          key={message.id}
          mt="2"
          w="fit-content"
          py="2"
          px="4"
          bg="white"
          border="1px solid #C8D7CB"
          borderRadius="lg"
        >
          <HStack spacing={4}>
            <Text>{message.message}</Text>
            <Text fontSize="13px" lineHeight="18px" fontWeight="500">
              {getTime(message.timestamp)}
            </Text>
          </HStack>
        </Box>
      ))}
    </Box>
  );
};
