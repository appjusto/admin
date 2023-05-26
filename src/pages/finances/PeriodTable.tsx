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
  // helpers
  const monthName = month ? getMonthName(month.getMonth()) : 'N/E';
  const year = month ? month.getFullYear() : 'N/E';
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
                {t('Taxas - AppJusto')}
                <Tooltip
                  placement="top"
                  label={t(
                    '5% de comissão do AppJusto que incide somente sobre o valor dos produtos vendidos'
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
              <Td isNumeric>{formatCurrency(extras)}</Td>
            </Tr>
          </>
        )}
      </Tbody>
      <Tfoot bgColor="gray.50">
        <Tr>
          <Th>
            {t(
              `Resultado para ${monthName} de ${year} (Total de pedidos: ${ordersNumber})`
            )}
          </Th>
          <Th color="green.700" isNumeric>
            {formatCurrency(netValue)}
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
