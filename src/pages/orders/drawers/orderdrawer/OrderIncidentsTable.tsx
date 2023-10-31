import { Incident, WithId } from '@appjusto/types';
import {
  Box,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface OrderIncidentsTableProps {
  incidents?: WithId<Incident>[] | null;
}

export const OrderIncidentsTable = ({
  incidents,
}: OrderIncidentsTableProps) => {
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
            {incidents && incidents.length > 0 ? (
              incidents?.map((incident) => (
                <Tr
                  key={incident.id}
                  color="black"
                  fontSize="xs"
                  fontWeight="700"
                >
                  <Td>{getDateAndHour(incident.createdAt)}</Td>
                  <Td>{getParticipant(incident.issue.type)}</Td>
                  <Td>
                    <Text lineHeight="14px">
                      {t('Motivo: ')}
                      <Text as="span" fontWeight="500">
                        {incident.issue.title}
                      </Text>
                    </Text>
                    {incident.comment && (
                      <>
                        <br />
                        <HStack spacing={2}>
                          <Text>{t('Comentário:')}</Text>
                          <Text fontWeight="500" lineHeight="16px">
                            {incident.comment}
                          </Text>
                        </HStack>
                      </>
                    )}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr color="black" fontSize="xs" fontWeight="700">
                <Td>
                  {t('Não foram registrados problemas para este pedido.')}
                </Td>
                <Td></Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
