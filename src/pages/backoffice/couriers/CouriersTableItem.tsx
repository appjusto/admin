import { Icon, Td, Tr } from '@chakra-ui/react';
import { CourierProfile, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  courier: WithId<CourierProfile>;
}

const options = {
  pending: 'Pendente',
  submitted: 'Submetido',
  verified: 'Verificado',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  blocked: 'Bloqueado',
  deleted: 'Deletado',
};

export const CouriersTableItem = ({ courier }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const status = courier.situation;
  return (
    <Tr key={courier.id} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{courier.id}</Td>
      <Td>
        {courier.createdOn ? getDateAndHour(courier.createdOn as firebase.firestore.Timestamp) : ''}
      </Td>
      <Td>{courier.name ?? 'N/I'}</Td>
      <Td>{options[status]}</Td>
      <Td>
        <Icon
          mt="-2px"
          viewBox="0 0 200 200"
          color={courier?.status === 'available' ? 'green.500' : 'red'}
        >
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
          link={`${path}/${courier.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
