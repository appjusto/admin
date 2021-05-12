import { Icon, Td, Tr } from '@chakra-ui/react';
import { CourierAlgolia, ProfileSituation } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { situationPTOptions } from '../utils';
interface ItemProps {
  courier: CourierAlgolia;
}

export const CouriersTableItem = ({ courier }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const status = courier.situation as ProfileSituation;
  return (
    <Tr key={courier.objectID} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{courier.code}</Td>
      <Td>
        {courier.createdOn
          ? getAlgoliaFieldDateAndHour(courier.createdOn as firebase.firestore.Timestamp)
          : 'N/I'}
      </Td>
      <Td>{courier.name ?? 'N/I'}</Td>
      <Td>{situationPTOptions[status] ?? 'N/I'}</Td>
      <Td>
        <Icon
          mt="-2px"
          viewBox="0 0 200 200"
          color={courier?.status === 'available' ? 'green.500' : 'gray.50'}
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
          link={`${path}/${courier.objectID}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
