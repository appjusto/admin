import { PushCampaign, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { PushCampaignTableItem } from './PushCampaignTableItem';

interface PushCampaignTableProps {
  campaigns?: WithId<PushCampaign>[];
}

export const PushCampaignTable = ({ campaigns }: PushCampaignTableProps) => {
  // UI
  return (
    <Box mt="8">
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('Criada em')}</Th>
            <Th>{t('Agendada para')}</Th>
            <Th>{t('Nome')}</Th>
            <Th>{t('Status')}</Th>
            <Th>{t('Audiência')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {campaigns === undefined ? (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Carregando agentes...')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          ) : campaigns.length > 0 ? (
            campaigns.map((campaign) => {
              return (
                <PushCampaignTableItem key={campaign.id} campaign={campaign} />
              );
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não há campanhas adicionadas.')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
