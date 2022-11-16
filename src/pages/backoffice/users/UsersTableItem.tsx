import { User, WithId } from '@appjusto/types';
import { Icon } from '@chakra-ui/react';
import TableItem from 'common/components/backoffice/TableItem';
import { MdBlock } from 'react-icons/md';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';

interface ItemProps {
  user: WithId<User>;
}

export const UsersTableItem = ({ user }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  // UI
  return (
    <TableItem
      key={user.id}
      link={`${path}/${user.id}`}
      columns={[
        { value: user.id ?? 'N/I' },
        { value: getDateAndHour(user.lastSignInRequest) },
        {
          value: (
            <Icon
              mt="-2px"
              viewBox="0 0 200 200"
              color={user?.manager ? 'green.500' : 'gray.200'}
            >
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          ),
          styles: { textAlign: 'center' },
        },
        {
          value: (
            <Icon
              mt="-2px"
              viewBox="0 0 200 200"
              color={user?.courier ? 'green.500' : 'gray.200'}
            >
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          ),
          styles: { textAlign: 'center' },
        },
        {
          value: (
            <Icon
              mt="-2px"
              viewBox="0 0 200 200"
              color={user?.consumer ? 'green.500' : 'gray.200'}
            >
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          ),
          styles: { textAlign: 'center' },
        },
        {
          value: (
            <Icon as={MdBlock} color={user.blocked ? 'red' : 'gray.200'} />
          ),
          styles: { textAlign: 'center' },
        },
      ]}
    />
  );
};
