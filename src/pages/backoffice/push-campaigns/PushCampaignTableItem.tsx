import { PushCampaign, WithId } from '@appjusto/types';
import TableItem from 'common/components/backoffice/TableItem';
import { useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { flavorsPTOptions, pushStatusPTOptions } from '../utils';

interface PushCampaignTableItemProps {
  campaign: WithId<PushCampaign>;
}

export const PushCampaignTableItem = ({
  campaign,
}: PushCampaignTableItemProps) => {
  // context
  const { path } = useRouteMatch();
  // state
  // UI
  return (
    <TableItem
      key={campaign.id}
      link={`${path}/${campaign.id}`}
      columns={[
        { value: getDateAndHour(campaign.createdOn) },
        { value: getDateAndHour(campaign.scheduledTo) },
        { value: campaign.name },
        { value: campaign.to ? flavorsPTOptions[campaign.to] : 'N/E' },
        { value: pushStatusPTOptions[campaign.status] },
        { value: campaign.audience ?? 0, styles: { isNumeric: true } },
      ]}
    />
  );
};
