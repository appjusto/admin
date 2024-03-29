import {
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { useFetchBusinessSubscriptionByPeriod } from 'app/api/ledger/useFetchBusinessSubscriptionByPeriod';
import { useFetchBusinessOrdersByMonth } from 'app/api/order/useFetchBusinessOrdersByMonth';
import { usePlatformFees } from 'app/api/platform/usePlatformFees';
import { useContextBusinessId } from 'app/state/business/context';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { formatCurrency, getMonthName } from 'utils/formatters';
import { t } from 'utils/i18n';

interface PeriodTableProps {
  month: Date | null;
}

export const PeriodTable = ({ month }: PeriodTableProps) => {
  // context
  const { platformFees } = usePlatformFees();
  const businessId = useContextBusinessId();
  // state
  const {
    productsAmount,
    deliveryAmount,
    iuguCosts,
    comission,
    extras,
    netValue,
    ordersNumber,
  } = useFetchBusinessOrdersByMonth(businessId, month);
  const subscription = useFetchBusinessSubscriptionByPeriod(businessId, month);
  // helpers
  const lastMonth = month ? getMonthName(month.getMonth() - 1) : 'N/E';
  const currentMonth = month ? getMonthName(month.getMonth()) : 'N/E';
  const year = month ? month.getFullYear() : 'N/E';
  const total = netValue - subscription;
  // UI
  return (
    <Table mt="6" size="md" variant="simple">
      <Tbody>
        {productsAmount === undefined ? (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Carregando...')}</Td>
            <Td></Td>
          </Tr>
        ) : (
          <>
            <Tr color="black" fontSize="xs" fontWeight="500">
              <Td>{t('Total de vendas de produtos')}</Td>
              <Td isNumeric>{formatCurrency(productsAmount)}</Td>
            </Tr>
            <Tr fontSize="xs" fontWeight="500">
              <Td color="black">
                {t('Taxas - appjusto')}
                <Tooltip
                  placement="top"
                  label={t(
                    'Taxas cobradas para pedidos com entrega appjusto, que incidem somente sobre o valor dos produtos vendidos'
                  )}
                >
                  <Text as="span">
                    <Icon
                      ml="2"
                      w="16px"
                      h="16px"
                      cursor="pointer"
                      as={MdInfoOutline}
                    />
                  </Text>
                </Tooltip>
              </Td>
              <Td color="red" isNumeric>
                {`- ${formatCurrency(comission)}`}
              </Td>
            </Tr>
            <Tr color="black" fontSize="xs" fontWeight="500">
              <Td>{t('Total recebido por entregas')}</Td>
              <Td isNumeric>{formatCurrency(deliveryAmount)}</Td>
            </Tr>
            <Tr fontSize="xs" fontWeight="500">
              <Td color="black">
                {t('Taxas - Iugu')}
                <Tooltip
                  placement="top"
                  label={
                    platformFees?.iuguFeeDescription ??
                    'Informação não encontrada'
                  }
                >
                  <Text as="span">
                    <Icon
                      ml="2"
                      w="16px"
                      h="16px"
                      cursor="pointer"
                      as={MdInfoOutline}
                    />
                  </Text>
                </Tooltip>
              </Td>
              <Td color="red" isNumeric>
                {`- ${formatCurrency(iuguCosts)}`}
              </Td>
            </Tr>
            <Tr color="black" fontSize="xs" fontWeight="500">
              <Td>{t('Extras (cobertura e conciliações)')}</Td>
              <Td isNumeric color={extras < 0 ? 'red' : 'black'}>
                {formatCurrency(extras)}
              </Td>
            </Tr>
            <Tr color="black" fontSize="xs" fontWeight="500">
              <Td>
                {t(`Mensalidade / ${lastMonth} (isenta até 30 pedidos no mês)`)}
              </Td>
              <Td isNumeric color="red">
                {`- ${formatCurrency(subscription)}`}
              </Td>
            </Tr>
          </>
        )}
      </Tbody>
      <Tfoot bgColor="gray.50">
        <Tr>
          <Th>
            {t(
              `Resultado para ${currentMonth} de ${year} (Total de pedidos: ${ordersNumber})`
            )}
          </Th>
          <Th color={total >= 0 ? 'green.700' : 'red'} isNumeric>
            {formatCurrency(total)}
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
