import { Td, Tr } from '@chakra-ui/react';
import { ConsumerProfile, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  consumer: WithId<ConsumerProfile>;
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

export const ConsumersTableItem = ({ consumer }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const status = consumer.situation;
  return (
    <Tr key={consumer.id} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{consumer.id}</Td>
      <Td>
        {consumer.createdOn
          ? getDateAndHour(consumer.createdOn as firebase.firestore.Timestamp)
          : ''}
      </Td>
      <Td>{consumer.name ?? 'N/I'}</Td>
      <Td>{options[status]}</Td>
      <Td color="red">*</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${consumer.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
