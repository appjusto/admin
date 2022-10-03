import { Box, Button, Checkbox, Flex, Skeleton, Text } from '@chakra-ui/react';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { BasicInfoBox } from '../BasicInfoBox';
import { FinancesBaseDrawer } from '../FinancesBaseDrawer';

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
  // UI
  return (
    <FinancesBaseDrawer
      onClose={onClose}
      title={t('Antecipação dos valores')}
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
            {t('Confirmar adiantamento')}
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
      <Text mt="6" fontSize="16px" fontWeight="500" lineHeight="22px">
        {t(
          'O prazo padrão para processar os pagamentos é de 30 dias. Para antecipar, você paga uma taxa de até 2.75% por operação. Funciona assim: se for antecipar no primeiro dia útil após a corrida, você pagará o valor cheio de 2.75%, e a taxa diminui proporcionalmente a cada dia que passa. Se você esperar 15 dias, por exemplo, pagará 1.37%.'
        )}
      </Text>
      <Text mt="-2" color="red">
        {t(
          'Atenção: a Iugu só permite realizar antecipações em dias úteis, de 09:00 às 16:00 e só é possível antecipar faturas pagas há mais de 2 dias úteis.'
        )}
      </Text>
      <Box mt="4">
        <Text fontSize="15px" fontWeight="500" lineHeight="21px">
          {t('Valor solicitado:')}
        </Text>
        <Text fontSize="24px" fontWeight="500" lineHeight="30px">
          {formatCurrency(amount)}
        </Text>
      </Box>
      <Box mt="6">
        <Text fontSize="15px" fontWeight="500" lineHeight="21px">
          {t('Total a antecipar')}
        </Text>
        {advancedValue === undefined ? (
          <Skeleton mt="1" maxW="294px" height="30px" colorScheme="#9AA49C" />
        ) : advancedValue === null ? (
          'N/E'
        ) : (
          <Text
            fontSize="24px"
            fontWeight="500"
            lineHeight="30px"
            color="green.700"
          >
            + {formatCurrency(advancedValue)}
          </Text>
        )}
      </Box>
      <Box mt="6">
        <Text fontSize="15px" fontWeight="500" lineHeight="21px">
          {t('Total de taxas de antecipação')}
        </Text>
        {advanceFee === undefined ? (
          <Skeleton mt="1" maxW="294px" height="30px" colorScheme="#9AA49C" />
        ) : advanceFee === null ? (
          'N/E'
        ) : (
          <Text fontSize="24px" fontWeight="500" lineHeight="30px" color="red">
            - {formatCurrency(advanceFee)}
          </Text>
        )}
      </Box>
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
            'Estou de acordo com as taxas cobradas para o adiantamento do valor'
          )}
        </Text>
      </Checkbox>
    </FinancesBaseDrawer>
  );
};
