import { User, WithId } from '@appjusto/types';
import { Icon, Td, Tr } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { MdBlock } from 'react-icons/md';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  user: WithId<User>;
}

export const UsersTableItem = ({ user }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  // UI
  return (
    <Tr key={user.id} color="black" fontSize="15px" lineHeight="21px">
      <Td>{user.id ?? 'N/I'}</Td>
      <Td>{getDateAndHour(user.lastSignInRequest)}</Td>
      <Td textAlign="center">
        <Icon mt="-2px" viewBox="0 0 200 200" color={user?.manager ? 'green.500' : 'gray.200'}>
          <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </Icon>
      </Td>
      <Td textAlign="center">
        <Icon mt="-2px" viewBox="0 0 200 200" color={user?.courier ? 'green.500' : 'gray.200'}>
          <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </Icon>
      </Td>
      <Td textAlign="center">
        <Icon mt="-2px" viewBox="0 0 200 200" color={user?.consumer ? 'green.500' : 'gray.200'}>
          <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </Icon>
      </Td>
      <Td textAlign="center">
        <Icon as={MdBlock} color={user.blocked ? 'red' : 'gray.200'} />
      </Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${user.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
