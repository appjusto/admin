import { OrderIssue, WithId } from '@appjusto/types';
import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import { MdErrorOutline } from 'react-icons/md';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
interface OrderIssuesTableProps {
  issues?: WithId<OrderIssue>[] | null;
  isCancellationDenied?: boolean;
}

export const OrderIssuesTable = ({
  issues,
  isCancellationDenied,
}: OrderIssuesTableProps) => {
  const { isBackofficeUser } = useContextFirebaseUser();
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
      {isBackofficeUser && isCancellationDenied && (
        <Flex
          mt="4"
          p="4"
          flexDir="row"
          border="1px solid red"
          borderRadius="lg"
          bgColor="redLight"
          color="red"
          maxW="600px"
        >
          <Center>
            <Icon as={MdErrorOutline} w="24px" h="24px" />
          </Center>
          <Box ml="2">
            <Text fontWeight="700">
              {t(
                'O restaurante rejeitou o cancelamento por meio do software integrado'
              )}
            </Text>
            <Text fontWeight="500">
              {t(
                'Entrar em contato para informar sobre o cancelamento realizado.'
              )}
            </Text>
          </Box>
        </Flex>
      )}
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
