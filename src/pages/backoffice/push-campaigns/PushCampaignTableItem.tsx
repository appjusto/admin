import { PushCampaign, WithId } from '@appjusto/types';
import { Td, Tr } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
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
    <Tr key={campaign.id} color="black" fontSize="sm" h="66px">
      <Td>{getDateAndHour(campaign.createdOn)}</Td>
      <Td>{getDateAndHour(campaign.scheduledTo)}</Td>
      <Td>{campaign.name}</Td>
      <Td>{campaign.to ? flavorsPTOptions[campaign.to] : 'N/E'}</Td>
      <Td>{pushStatusPTOptions[campaign.status]}</Td>
      <Td>{campaign.audience ?? 0}</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${campaign.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
