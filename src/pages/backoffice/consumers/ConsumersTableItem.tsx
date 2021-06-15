import { Td, Tr } from '@chakra-ui/react';
import { ConsumerAlgolia } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import firebase from 'firebase';
import { useRouteMatch } from 'react-router';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  consumer: ConsumerAlgolia;
}

export const ConsumersTableItem = ({ consumer }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  //  UI
  const name = consumer.name ? `${consumer.name} ${consumer.surname ?? ''}` : 'N/I';
  return (
    <Tr key={consumer.objectID} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{consumer.code ?? 'N/I'}</Td>
      <Td>
        {consumer.createdOn
          ? getAlgoliaFieldDateAndHour(consumer.createdOn as firebase.firestore.Timestamp)
          : ''}
      </Td>
      <Td>{name}</Td>
      <Td isNumeric>{consumer.totalOrders ?? 0}</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${consumer.objectID}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
