import { Td, Tr } from '@chakra-ui/react';
import { User, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
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
