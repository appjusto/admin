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
import { useReceivablesSimulation } from 'app/api/business/useReceivablesSimulation';
import { useCanAdvanceReceivables } from 'app/api/platform/useCanAdvanceReceivables';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
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
  const businessId = useContextBusinessId();
  const { advanceReceivables, advanceReceivablesResult } =
    useAdvanceReceivables(businessId);
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
  } = useReceivablesSimulation(businessId);
  // refs
  const amountInputRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const actionLabel = canAdvanceReceivables
    ? t('Simular antecipação')
    : t('Fora do horário');
  const isAmountInvalid =
    simulateOption === 'auto'
      ? false
      : advanceableValue
      ? amount > advanceableValue
      : false;
  // handlers
  const handleReceivablesRequest = async () => {
    if (isAmountInvalid) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AdvancesDrawer-invalid-amount',
        message: {
          title:
            'O valor solicitado é maior que o valor disponível para esta operação',
        },
      });
    }
    if (!isReviewing) {
      try {
        const requestedValue =
          simulateOption === 'auto' ? advanceableValue! : amount;
        await fetchReceivablesSimulation(requestedValue);
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
            isDisabled={!canAdvanceReceivables}
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
        label={t('Vendas a compensar')}
        icon={Checked}
        value={formatIuguValueToDisplay(receivableBalance ?? 'R$ 0,00')}
      />
      <Flex mt="4" flexDir="row">
        <Icon mt="1" as={MdInfoOutline} />
        <Text ml="2" fontSize="15px" fontWeight="500" lineHeight="22px">
          {t(
            'Valores referêntes a pedidos agendados e pagos via PIX são disponibilizados diretamente na sua tela de saque em até 24h.'
          )}
        </Text>
      </Flex>
      <Box mt="8" borderTop="1px solid #C8D7CB">
        <Text mt="6" fontSize="2xl" fontWeight="700">
          {t('Antecipação dos valores')}
        </Text>
        {/* <Text fontSize="16px" fontWeight="500" lineHeight="22px">
          {t(
            'O prazo padrão para processar os pagamentos é de 30 dias. Para antecipar, você paga uma taxa de até 2.75% por operação. Funciona assim: se for antecipar no primeiro dia útil após a corrida, você pagará o valor cheio de 2.75%, e a taxa diminui proporcionalmente a cada dia que passa. Se você esperar 15 dias, por exemplo, pagará 1.37%.'
            )}
          </Text> */}
        <Text mt="4" fontSize="16px" fontWeight="500" lineHeight="22px">
          {t(
            'Apenas as faturas pagas com cartão de crédito há mais de 2 dias úteis têm seus valores disponíveis para antecipação.'
          )}
        </Text>
        <BasicInfoBox
          mt="4"
          label={t('Disponível para antecipação')}
          icon={Checked}
          value={formatCurrency(advanceableValue ?? 0)}
        />
        <Flex mt="4" flexDir="row" color="red">
          <Icon mt="1" as={MdInfoOutline} />
          <Text ml="2" fontSize="15px" fontWeight="500" lineHeight="22px">
            {t(
              'A Iugu só permite realizar antecipações em dias úteis, de 09:00 às 16:00.'
            )}
          </Text>
        </Flex>
        <SectionTitle>{t('Simular antecipação')}</SectionTitle>
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
      </Box>
    </FinancesBaseDrawer>
  );
};
