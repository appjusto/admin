import { Box, Flex, HStack, Image, Text } from '@chakra-ui/react';
import managerIcon from 'common/img/manager.svg';
import firebase from 'firebase';
import { getDateAndHour } from 'utils/functions';

interface ChatMessagesProps {
  image: string;
  name: string;
  message: string;
  timestamp: firebase.firestore.FieldValue;
  isGrouped: boolean;
}

export const ChatMessages = ({ image, name, message, timestamp, isGrouped }: ChatMessagesProps) => {
  // helpers
  const getTime = (timestamp: firebase.firestore.FieldValue) => {
    if (!timestamp) return;
    const fullDate = getDateAndHour(timestamp);
    const time = fullDate.split(' ')[1];
    return time;
  };

  // UI
  return (
    <Box mt="4" mb="2">
      {!isGrouped && (
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
      )}
      <Box
        mt="2"
        w="fit-content"
        py="2"
        px="4"
        bg="white"
        border="1px solid #C8D7CB"
        borderRadius="lg"
      >
        <HStack spacing={4}>
          <Text>{message}</Text>
          <Text fontSize="13px" lineHeight="18px" fontWeight="500">
            {getTime(timestamp)}
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};
