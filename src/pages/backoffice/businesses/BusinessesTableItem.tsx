import { Icon, Td, Tr } from '@chakra-ui/react';
import { BusinessAlgolia, ProfileSituation } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  business: BusinessAlgolia;
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

export const BusinessesTableItem = ({ business }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const status = business.situation as ProfileSituation;
  const step = business.onboarding;
  return (
    <Tr key={business.objectID} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{business.code ?? 'N/I'}</Td>
      <Td>
        {business.createdOn
          ? getAlgoliaFieldDateAndHour(business.createdOn as firebase.firestore.Timestamp)
          : 'N/I'}
      </Td>
      <Td>{business.name ?? 'N/I'}</Td>
      <Td>{options[status] ?? 'N/I'}</Td>
      <Td>{step ? (step === 'completed' ? 'completo' : step) : 'N/I'}</Td>
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
          link={`${path}/${business.objectID}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
