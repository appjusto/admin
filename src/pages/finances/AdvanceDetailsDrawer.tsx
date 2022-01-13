import { Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { AccountAdvance, WithId } from 'appjusto-types';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { useParams } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';
import { formatIuguValueToDisplay } from './utils';

interface AdvanceDetailsDrawerProps {
  isOpen: boolean;
  getAdvanceById(advanceId: string): WithId<AccountAdvance> | null;
  onClose(): void;
}

type Params = {
  advanceId: string;
};

export const AdvanceDetailsDrawer = ({
  onClose,
  getAdvanceById,
  ...props
}: AdvanceDetailsDrawerProps) => {
  // context
  const { advanceId } = useParams<Params>();
  // state
  const [advance, setAdvance] = React.useState<WithId<AccountAdvance> | null>();
  // side effects
  React.useEffect(() => {
    setAdvance(getAdvanceById(advanceId));
  }, [advanceId, getAdvanceById]);
  // UI
  return (
    <FinancesBaseDrawer onClose={onClose} title={t('Detalhes da antecipação')} {...props}>
      <Text fontSize="md" fontWeight="700" color="black">
        {t('Criada em:')}{' '}
        <Text as="span" fontWeight="500">
          {advance?.createdOn ? getDateAndHour(advance.createdOn) : 'N/E'}
        </Text>
      </Text>
      <Text fontSize="md" fontWeight="700" color="black">
        {t('Valor solicitado:')}{' '}
        <Text as="span" fontWeight="500">
          {advance?.data.total.advanced_value
            ? formatIuguValueToDisplay(advance.data.total.advanced_value)
            : 'N/E'}
        </Text>
      </Text>
      <Text fontSize="md" fontWeight="700" color="black">
        {t('Taxa:')}{' '}
        <Text as="span" color="red" fontWeight="500">
          -{' '}
          {advance?.data.total.advance_fee
            ? formatIuguValueToDisplay(advance.data.total.advance_fee)
            : 'N/E'}
        </Text>
      </Text>
      <Text fontSize="md" fontWeight="700" color="black">
        {t('Valor antecipado:')}{' '}
        <Text as="span" color="green.700" fontWeight="500">
          {advance?.data.total.received_value
            ? formatIuguValueToDisplay(advance.data.total.received_value)
            : 'N/E'}
        </Text>
      </Text>
      <SectionTitle>{t('Transações:')}</SectionTitle>
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('ID')}</Th>
            <Th isNumeric>{t('Valor solicitado')}</Th>
            <Th isNumeric>{t('Taxa de antecipação')}</Th>
            <Th isNumeric>{t('Valor antecipado')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {advance !== undefined ? (
            advance !== null ? (
              advance.data.transactions.map((transaction) => {
                return (
                  <Tr
                    key={transaction.id}
                    color="black"
                    fontSize="15px"
                    lineHeight="21px"
                    fontWeight="500"
                  >
                    <Td>{transaction.id}</Td>
                    <Td isNumeric>
                      {transaction.advanced_value
                        ? formatIuguValueToDisplay(transaction.advanced_value)
                        : 'N/E'}
                    </Td>
                    <Td color="red" isNumeric>
                      -{' '}
                      {transaction.advance_fee
                        ? formatIuguValueToDisplay(transaction.advance_fee)
                        : 'N/E'}
                    </Td>
                    <Td color="green.700" isNumeric>
                      {transaction.received_value
                        ? formatIuguValueToDisplay(transaction.received_value)
                        : 'N/E'}
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr color="black" fontSize="xs" fontWeight="700">
                <Td>{t('Sem resultados para o número informado')}</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            )
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Carregando...')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </FinancesBaseDrawer>
  );
};
