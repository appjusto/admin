import { BusinessRecommendation, WithId } from '@appjusto/types';
import TableItem from 'common/components/backoffice/TableItem';
import { phoneFormatter } from 'common/components/form/input/pattern-input/formatters';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';

interface ItemProps {
  recommendation: WithId<BusinessRecommendation>;
}

export const RecommendationsTableItem = ({ recommendation }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  // UI
  return (
    <TableItem
      key={recommendation.id}
      link={`${path}/${recommendation.id}`}
      columns={[
        {
          value: recommendation.createdOn
            ? getDateAndHour(recommendation.createdOn, true)
            : 'N/E',
          styles: { maxW: '130px' },
        },
        {
          value: recommendation.recommendedBusiness.address.main ?? 'N/E',
        },
        {
          value: recommendation.owner ?? 'N/I',
        },
        {
          value: recommendation.phone
            ? phoneFormatter(recommendation.phone)
            : 'N/I',
        },
        {
          value:
            recommendation.instagram && recommendation.instagram.length > 0
              ? recommendation.instagram
              : 'N/I',
          styles: { maxW: '120px' },
        },
      ]}
    />
  );
};
