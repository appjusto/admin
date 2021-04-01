import { Icon, Td, Tr } from '@chakra-ui/react';
import { Business, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  business: WithId<Business>;
}

export const BusinessesTableItem = ({ business }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const status = business.situation;
  const step = business.onboarding;
  return (
    <Tr key={business.id} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{business.id}</Td>
      <Td>
        {business.createdOn
          ? getDateAndHour(business.createdOn as firebase.firestore.Timestamp)
          : ''}
      </Td>
      <Td>{business.name}</Td>
      <Td>{status}</Td>
      <Td>{step}</Td>
      <Td>
        <Icon mt="-2px" viewBox="0 0 200 200" color={business?.enabled ? 'green.500' : 'red'}>
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
          link={`${path}/${business.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
