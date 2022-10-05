import { Box, Button, Checkbox, Flex, Text } from '@chakra-ui/react';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { BasicInfoBox } from '../BasicInfoBox';
import { FinancesBaseDrawer } from '../FinancesBaseDrawer';
import { ReviewBox } from './ReviewBox';

const valueDescription = [
  t(
    'Houve uma diferença entre o valor solicitado e aquele que pode ser antecipado, por que a Iugu seleciona o conjunto de faturas - priorizando aquelas mais próximas de sua data de compensação - em que a soma de seus valores se aproxima ao máximo do valor solicitado.'
  ),
];
const feeDescription = [
  t(
    'A taxa cobrada pela Iugu é de 2,75% sobre o valor de cada fatura, decrescendo proporcionalmente durante o período de processamento (30 dias).'
  ),
  t(
    'Ex: caso você solicite uma antecipação 15 dias após uma venda, a taxa cobrada para esta fatura será de 1,37% (metade dos 2,75%).'
  ),
  t(
    'Desse modo, a Iugu calcula o valor das taxas cobradas em cada uma das faturas que compõem o total a ser antecipado e exibe aqui esse somatório.'
  ),
];

interface AdvanceReviewProps {
  isOpen: boolean;
  onClose(): void;
  amount: number;
  advancedValue?: number | null;
  advanceFee?: number | null;
  receivedValue?: number;
  handleReceivablesRequest(): void;
  isLoading: boolean;
  setIsReviewing(value: boolean): void;
}

export const AdvanceReview = ({
  amount,
  advancedValue,
  advanceFee,
  receivedValue,
  handleReceivablesRequest,
  isLoading,
  setIsReviewing,
  onClose,
  ...props
}: AdvanceReviewProps) => {
  // state
  const [isFeesAccepted, setIsFeesAccepted] = React.useState(false);
  // refs
  const acceptCheckBoxRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const isSameValueRequested = amount === advancedValue;
  // UI
  return (
    <FinancesBaseDrawer
      onClose={onClose}
      title={t('Simulação da antecipação')}
      isReviewing
      footer={() => (
        <Flex w="100%" justifyContent="space-between">
          <Button
            minW="220px"
            fontSize="15px"
            onClick={handleReceivablesRequest}
            isLoading={isLoading}
            loadingText={t('Confirmando')}
            isDisabled={!isFeesAccepted}
          >
            {t('Confirmar antecipação')}
          </Button>
          <Button
            mr="16"
            fontSize="15px"
            variant="outline"
            onClick={() => setIsReviewing(false)}
          >
            {t('Voltar')}
          </Button>
        </Flex>
      )}
      {...props}
    >
      <Text mt="-2" fontSize="16px" fontWeight="500" lineHeight="22px">
        {t(
          'Abaixo são exibidos os valores referentes à operação. Se desejar prosseguir com a antecipação, basta marcar que está de acordo com a taxa cobrada pela Iugu e confirmar.'
        )}
      </Text>
      <Box mt="8">
        <Text fontSize="15px" fontWeight="500" lineHeight="21px">
          {t('Valor solicitado:')}
        </Text>
        <Text fontSize="24px" fontWeight="500" lineHeight="30px">
          {formatCurrency(amount)}
        </Text>
      </Box>
      <ReviewBox
        label={t('Total a antecipar')}
        valueToDisplay={advancedValue}
        description={valueDescription}
        showInfoDefault={!isSameValueRequested}
      />
      <ReviewBox
        label={t('Total de taxas de antecipação (Iugu)')}
        valueToDisplay={advanceFee}
        signal="-"
        description={feeDescription}
        isInfo
      />
      <BasicInfoBox
        mt="6"
        label={t('Total a receber na antecipação')}
        icon={Checked}
        value={formatCurrency(receivedValue ?? 0)}
      />
      <Checkbox
        ref={acceptCheckBoxRef}
        mt="6"
        borderColor="black"
        borderRadius="lg"
        colorScheme="green"
        isChecked={isFeesAccepted}
        onChange={(e) => setIsFeesAccepted(e.target.checked)}
      >
        <Text fontSize="15px" fontWeight="500" lineHeight="21px">
          {t(
            'Estou de acordo com as taxas cobradas para a antecipação do valor.'
          )}
        </Text>
      </Checkbox>
    </FinancesBaseDrawer>
  );
};
