import { Icon, Td, Tr } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ChatsTableItemProps {
  chat: any;
}

export const ChatsTableItem = ({ chat }: ChatsTableItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const newMessage = true;
  //  UI
  return (
    <Tr color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{chat.code ?? 'N/I'}</Td>
      <Td>
        {chat.createdOn
          ? getAlgoliaFieldDateAndHour(chat.createdOn as firebase.firestore.Timestamp)
          : ''}
      </Td>
      <Td>{'Entregador'}</Td>
      <Td>{'Nome do entregador'}</Td>
      <Td w={{ lg: '180px' }} textAlign="center">
        <Icon mt="-2px" viewBox="0 0 200 200" color={newMessage ? 'green.500' : 'gray.50'}>
          <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </Icon>
      </Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${chat.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
