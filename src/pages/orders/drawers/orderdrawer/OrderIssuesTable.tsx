import { OrderIssue, WithId } from '@appjusto/types';
import { Box, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
interface OrderIssuesTableProps {
  issues?: WithId<OrderIssue>[] | null;
}

export const OrderIssuesTable = ({ issues }: OrderIssuesTableProps) => {
  // helpers
  const getParticipant = (type: string) => {
    let participant = 'N/E';
    if (type.includes('agent')) participant = 'Agente Appjusto';
    if (type.includes('courier')) participant = 'Entregador';
    if (type.includes('restaurant')) participant = 'Restaurante';
    if (type.includes('consumer')) participant = 'Cliente';
    return participant;
  };
  // UI
  return (
    <Box>
      <SectionTitle>{t('Problemas')}</SectionTitle>
      <Box overflowX="auto">
        <Table mt="4" size="md" variant="simple">
          <Thead>
            <Tr>
              <Th maxW="340px">{t('Horário')}</Th>
              <Th>{t('Participante')}</Th>
              <Th>{t('Ocorrencia')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {issues && issues.length > 0 ? (
              issues?.map((issue: WithId<OrderIssue>) => (
                <Tr key={issue.id} color="black" fontSize="xs" fontWeight="700">
                  <Td>{getDateAndHour(issue.createdOn)}</Td>
                  <Td>{getParticipant(issue.issue.type)}</Td>
                  <Td>
                    <Text lineHeight="14px">
                      {t('Motivo: ')}
                      <Text as="span" fontWeight="500">
                        {issue.issue.title}
                      </Text>
                    </Text>
                    {issue.comment && (
                      <>
                        <br />
                        <HStack spacing={2}>
                          <Text>{t('Comentário:')}</Text>
                          <Text fontWeight="500" lineHeight="16px">
                            {issue.comment}
                          </Text>
                        </HStack>
                      </>
                    )}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr color="black" fontSize="xs" fontWeight="700">
                <Td>{t('Não foram registrados problemas para este pedido.')}</Td>
                <Td></Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
