import { Icon, Td, Text, Tr, VStack } from '@chakra-ui/react';
import { OrderChatGroup } from 'app/api/business/chat/useBusinessChats';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ChatsTableItemProps {
  chat: OrderChatGroup;
}

const flavorsPT = {
  courier: 'Entregador',
  consumer: 'Cliente',
};

export const ChatsTableItem = ({ chat }: ChatsTableItemProps) => {
  // context
  const { path } = useRouteMatch();

  // helpers
  const newMessage = true;

  //  UI
  return (
    <Tr color="black" fontSize="15px" lineHeight="21px">
      <Td>#{chat.orderCode}</Td>
      <Td>
        <VStack spacing={4} alignItems="flex-start">
          {chat.counterParts.map((part) => (
            <Text key={part.id}>
              {getDateAndHour(part.updatedOn as firebase.firestore.Timestamp)}
            </Text>
          ))}
        </VStack>
      </Td>
      <Td>
        <VStack spacing={4} alignItems="flex-start">
          {chat.counterParts.map((part) => (
            //@ts-ignore
            <Text key={part.id}>{flavorsPT[part.flavor]}</Text>
          ))}
        </VStack>
      </Td>
      <Td>
        <VStack spacing={4} alignItems="flex-start">
          {chat.counterParts.map((part) => (
            <Text key={part.id}>{part.name}</Text>
          ))}
        </VStack>
      </Td>
      <Td w={{ lg: '180px' }} textAlign="center">
        <VStack spacing={4}>
          {chat.counterParts.map((part) => (
            <Icon
              key={part.id}
              mt="-2px"
              viewBox="0 0 200 200"
              color={
                part.unreadMessages && part.unreadMessages?.length > 0 ? 'green.500' : 'gray.50'
              }
            >
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          ))}
        </VStack>
      </Td>
      <Td>
        <VStack spacing={4} alignItems="flex-end">
          {chat.counterParts.map((part) => (
            <CustomButton
              key={part.id}
              mt="0"
              w="200px"
              variant="outline"
              label={t('Abrir chat')}
              link={`${path}/${chat.orderId}/${part.id}`}
              size="sm"
            />
          ))}
        </VStack>
      </Td>
    </Tr>
  );
};
