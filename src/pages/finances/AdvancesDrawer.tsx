import {
  Box,
  Button,
  Flex,
  Icon,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAdvanceReceivables } from 'app/api/business/useAdvanceReceivables';
import { useIsBusinessSafe } from 'app/api/business/useIsBusinessSafe';
import { useReceivablesSimulation } from 'app/api/business/useReceivablesSimulation';
import { useCanAdvanceReceivables } from 'app/api/platform/useCanAdvanceReceivables';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import { isNumber } from 'lodash';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { AdvanceReview } from './advances/AdvanceReview';
import { SuccessfullResponse } from './advances/SuccessfulResponse';
import { BasicInfoBox } from './BasicInfoBox';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';
import { formatIuguValueToDisplay } from './utils';

interface WithdrawalsDrawerProps {
  receivableBalance?: string;
  advanceableValue?: number;
  isOpen: boolean;
  onClose(): void;
}

type SimulateOptions = 'auto' | 'manual';

export const AdvancesDrawer = ({
  receivableBalance,
  advanceableValue,
  onClose,
  ...props
}: WithdrawalsDrawerProps) => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business } = useContextBusiness();
  const isBusinessSafe = useIsBusinessSafe(business);
  const { advanceReceivables, advanceReceivablesResult } =
    useAdvanceReceivables(business?.id);
  const canAdvanceReceivables = useCanAdvanceReceivables();
  const [amount, setAmount] = React.useState<number>(0);
  const [simulateOption, setSimulateOption] =
    React.useState<SimulateOptions>('auto');
  const [isReviewing, setIsReviewing] = React.useState(false);
  const {
    fetchReceivablesSimulation,
    receivablesSimulationResult,
    simulationId,
    advancedValue,
    advanceFee,
    receivedValue,
  } = useReceivablesSimulation(business?.id);
  // refs
  const amountInputRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const actionLabel = canAdvanceReceivables
    ? t('Simular antecipação')
    : t('Fora do horário');
  const isAmountInvalid =
    !isNumber(advanceableValue) || amount === 0 || amount > advanceableValue;
  // handlers
  const handleReceivablesRequest = async () => {
    if (isAmountInvalid) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AdvancesDrawer-invalid-amount',
        message: {
          title: 'O valor solicitado não é válido',
        },
      });
    }
    if (!isReviewing) {
      try {
        await fetchReceivablesSimulation(amount);
        setIsReviewing(true);
      } catch (error) {
        console.error(error);
      }
      return;
    }
    if (!simulationId)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AdvancesDrawer-valid-no-value',
        message: { title: 'O Id da simulação não foi encontrado' },
      });
    if (!advancedValue || !advanceFee)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AdvancesDrawer-valid-no-value',
        message: { title: 'Parâmetros do adiantamento não encontrados' },
      });
    await advanceReceivables({
      simulationId,
      amount: advancedValue,
      fee: advanceFee,
    });
  };
  // side effects
  React.useEffect(() => {
    if (simulateOption === 'auto' && advanceableValue) {
      setAmount(advanceableValue);
    } else {
      amountInputRef.current?.focus();
    }
  }, [simulateOption, advanceableValue, amountInputRef]);
  // UI
  if (advanceReceivablesResult.isSuccess) {
    return (
      <SuccessfullResponse
        receivedValue={receivedValue}
        onClose={onClose}
        {...props}
      />
    );
  }
  if (isReviewing) {
    return (
      <AdvanceReview
        amount={amount}
        advancedValue={advancedValue}
        advanceFee={advanceFee}
        receivedValue={receivedValue}
        handleReceivablesRequest={handleReceivablesRequest}
        isLoading={advanceReceivablesResult.isLoading}
        setIsReviewing={setIsReviewing}
        onClose={onClose}
        {...props}
      />
    );
  }
  return (
    <FinancesBaseDrawer
      onClose={onClose}
      title={t('Vendas em processamento')}
      footer={() => (
        <Flex w="100%" justifyContent="space-between">
          <Button
            minW="220px"
            fontSize="15px"
            onClick={handleReceivablesRequest}
            isLoading={receivablesSimulationResult.isLoading}
            loadingText={t('Simulando')}
            isDisabled={!isBusinessSafe || !canAdvanceReceivables}
          >
            {actionLabel}
          </Button>
        </Flex>
      )}
      {...props}
    >
      <Text mt="-2" fontSize="16px" fontWeight="500" lineHeight="22px">
        {t(
          'Somatório de faturas pagas com cartão de crédito, há menos de 30 dias, e não antecipadas.'
        )}
      </Text>
      <BasicInfoBox
        mt="4"
        label={t('Vendas em processamento')}
        icon={Checked}
        value={formatIuguValueToDisplay(receivableBalance ?? 'R$ 0,00')}
      />
      <Flex mt="4" flexDir="row">
        <Icon mt="1" as={MdInfoOutline} />
        <Text ml="2" fontSize="15px" fontWeight="500" lineHeight="22px">
          {t(
            'O prazo padrão para processar pagamentos em cartão de crédito e disponibilizar seus valores para saque é de 30 dias.'
          )}
        </Text>
      </Flex>
      <Flex mt="4" flexDir="row">
        <Icon mt="1" as={MdInfoOutline} />
        <Text ml="2" fontSize="15px" fontWeight="500" lineHeight="22px">
          {t(
            'Valores referêntes a pedidos agendados e pagos via PIX são disponibilizados diretamente na sua tela de saque, em até 24h.'
          )}
        </Text>
      </Flex>
      <Box mt="8" borderTop="1px solid #C8D7CB">
        <Text mt="6" fontSize="2xl" fontWeight="700">
          {t('Antecipação de valores')}
        </Text>
        {isBusinessSafe ? (
          <>
            <Text mt="4" fontSize="16px" fontWeight="500" lineHeight="22px">
              {t(
                'Do total em processamento, apenas as faturas pagas há mais de 2 dias úteis têm seus valores disponíveis para antecipação.'
              )}
            </Text>
            <BasicInfoBox
              mt="4"
              label={t('Disponível para antecipação')}
              icon={Checked}
              value={formatCurrency(advanceableValue ?? 0)}
            />
            <Flex mt="2" flexDir="row" color="red">
              <Icon mt="1" as={MdInfoOutline} />
              <Text ml="2" fontSize="15px" fontWeight="500" lineHeight="22px">
                {t(
                  'A Iugu só permite realizar antecipações em dias úteis, de 09:00 às 16:00.'
                )}
              </Text>
            </Flex>
            <SectionTitle mt="4">{t('Simular antecipação')}</SectionTitle>
            <RadioGroup
              mt="4"
              value={simulateOption}
              onChange={(value: SimulateOptions) => setSimulateOption(value)}
            >
              <VStack alignItems="flex-start">
                <Radio value="auto">{t('Antecipar o valor total')}</Radio>
                <Radio value="manual">
                  {t('Informar quanto desejo antecipar')}
                </Radio>
              </VStack>
            </RadioGroup>
            {simulateOption === 'manual' && (
              <CurrencyInput
                ref={amountInputRef}
                isRequired
                maxW="220px"
                id="drawer-price"
                value={amount}
                label={t('Valor da antecipação')}
                aria-label={t('valor-da-antecipacao')}
                placeholder={t('0,00')}
                onChangeValue={(value) => setAmount(value)}
                isInvalid={isAmountInvalid}
              />
            )}
          </>
        ) : (
          <Text mt="4" fontSize="16px" fontWeight="500" lineHeight="22px">
            {t(
              'A função de antecipação de recebíveis em cartão de crédito ficará disponível após 30 dias da sua primeira venda.'
            )}
          </Text>
        )}
      </Box>
    </FinancesBaseDrawer>
  );
};
