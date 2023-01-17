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
import { usePlatformFees } from 'app/api/platform/usePlatformFees';
import { MdInfoOutline } from 'react-icons/md';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';

interface PeriodTableProps {
  period: string;
  total: number;
  amountProducts: number;
  amountDelivery: number;
  amountInsurance: number;
  appjustoCosts: number;
  iuguCosts: number;
}

export const PeriodTable = ({
  period,
  total,
  amountProducts,
  amountDelivery,
  amountInsurance,
  appjustoCosts,
  iuguCosts,
}: PeriodTableProps) => {
  // context
  const { platformFees } = usePlatformFees();
  // helpers
  const amountTotal =
    (amountProducts ?? 0) + (amountDelivery ?? 0) + (amountInsurance ?? 0);
  // UI
  return (
    <Table mt="6" size="md" variant="simple">
      <Tbody>
        {amountProducts === undefined ? (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Carregando...')}</Td>
            <Td></Td>
          </Tr>
        ) : (
          <>
            <Tr color="black" fontSize="xs" fontWeight="500">
              <Td>{t('Total de vendas de produtos')}</Td>
              <Td isNumeric>{formatCurrency(amountProducts)}</Td>
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
                {`- ${formatCurrency(appjustoCosts)}`}
              </Td>
            </Tr>
            <Tr color="black" fontSize="xs" fontWeight="500">
              <Td>{t('Total recebido por entregas')}</Td>
              <Td isNumeric>{formatCurrency(amountDelivery)}</Td>
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
              <Td>{t('Ressarcimentos (cobertura)')}</Td>
              <Td isNumeric>{formatCurrency(amountInsurance)}</Td>
            </Tr>
          </>
        )}
      </Tbody>
      <Tfoot bgColor="gray.50">
        <Tr>
          <Th>{t(`Resultado para ${period} (Total de pedidos: ${total})`)}</Th>
          <Th color="green.700" isNumeric>
            {formatCurrency(amountTotal - appjustoCosts - iuguCosts)}
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
