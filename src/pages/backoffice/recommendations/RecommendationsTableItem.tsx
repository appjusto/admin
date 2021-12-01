import { Td, Tr } from '@chakra-ui/react';
import { BusinessRecommendation, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { phoneFormatter } from 'common/components/form/input/pattern-input/formatters';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  recommendation: WithId<BusinessRecommendation>;
}

export const RecommendationsTableItem = ({ recommendation }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  // UI
  return (
    <Tr key={recommendation.id} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="130px">
        {recommendation.createdOn ? getDateAndHour(recommendation.createdOn, true) : 'N/E'}
      </Td>
      <Td>{recommendation.recommendedBusiness.address.main ?? 'N/E'}</Td>
      <Td>{recommendation.owner ?? 'N/I'}</Td>
      <Td>{recommendation.phone ? phoneFormatter(recommendation.phone) : 'N/I'}</Td>
      <Td maxW="120px">{recommendation.instagram ?? 'N/I'}</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${recommendation.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
