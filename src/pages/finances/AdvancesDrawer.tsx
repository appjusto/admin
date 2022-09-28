import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Skeleton,
  Text,
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
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { BasicInfoBox } from './BasicInfoBox';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';

interface WithdrawalsDrawerProps {
  advanceableValue?: number;
  isOpen: boolean;
  onClose(): void;
}

export const AdvancesDrawer = ({
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
  const [isReviewing, setIsReviewing] = React.useState(false);
  const [isFeesAccepted, setIsFeesAccepted] = React.useState(false);
  const {
    fetchReceivablesSimulation,
    receivablesSimulationResult,
    simulationId,
    advancedValue,
    advanceFee,
    receivedValue,
  } = useReceivablesSimulation(businessId);
  // refs
  const acceptCheckBoxRef = React.useRef<HTMLInputElement>(null);
  const amountInputRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const isLoading =
    receivablesSimulationResult.isLoading || advanceReceivablesResult.isLoading;
  const actionLabel = isReviewing
    ? t('Confirmar adiantamento')
    : canAdvanceReceivables
    ? t('Revisar adiantamento')
    : t('Fora do horário');
  const loadingText = isReviewing ? t('Confirmando') : t('Simulando');
  const isAmountInvalid = advanceableValue ? amount > advanceableValue : false;
  // handlers
  const getActionDisabledSatus = () => {
    if (!canAdvanceReceivables) return true;
    if (amount === 0) return true;
    if (isReviewing && !isFeesAccepted) return true;
    return false;
  };
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
  // UI
  if (advanceReceivablesResult.isSuccess) {
    return (
      <FinancesBaseDrawer
        onClose={onClose}
        title={t('Antecipação dos valores')}
        isReviewing={isReviewing}
        {...props}
      >
        <Flex w="100%" h="100%" flexDir="column" justifyContent="center">
          <Box>
            <Icon as={Checked} w="36px" h="36px" />
            <Text
              mt="2"
              fontSize="24px"
              fontWeight="500"
              lineHeight="30px"
              color="black"
            >
              {t('Antecipação realizada com sucesso!')}
            </Text>
            <Text mt="1" fontSize="18px" fontWeight="500" lineHeight="26px">
              {t(
                `Em até 1 dia útil o valor de ${formatCurrency(
                  receivedValue!
                )} estará disponível para saque.`
              )}
            </Text>
          </Box>
        </Flex>
      </FinancesBaseDrawer>
    );
  }
  return (
    <FinancesBaseDrawer
      onClose={onClose}
      title={t('Antecipação dos valores')}
      description={t(
        'O prazo padrão para processar os pagamentos é de 30 dias. Para antecipar, você paga uma taxa de até 2.75% por operação. Funciona assim: se for antecipar no primeiro dia útil após a corrida, você pagará o valor cheio de 2.75%, e a taxa diminui proporcionalmente a cada dia que passa. Se você esperar 15 dias, por exemplo, pagará 1.37%.'
      )}
      isReviewing={isReviewing}
      footer={() => (
        <Flex w="100%" justifyContent="space-between">
          <Button
            minW="220px"
            fontSize="15px"
            onClick={handleReceivablesRequest}
            isLoading={isLoading}
            loadingText={loadingText}
            isDisabled={getActionDisabledSatus()}
          >
            {actionLabel}
          </Button>
          {isReviewing && (
            <Button
              mr="16"
              fontSize="15px"
              variant="outline"
              onClick={() => setIsReviewing(false)}
            >
              {t('Voltar')}
            </Button>
          )}
        </Flex>
      )}
      {...props}
    >
      <Text mt="-2" color="red">
        {t(
          'Atenção: a Iugu só permite realizar antecipações em dias úteis, de 09:00 às 16:00 e só é possível antecipar faturas pagas há mais de 2 dias úteis.'
        )}
      </Text>
      {isReviewing ? (
        <>
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
              <Skeleton
                mt="1"
                maxW="294px"
                height="30px"
                colorScheme="#9AA49C"
              />
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
              <Skeleton
                mt="1"
                maxW="294px"
                height="30px"
                colorScheme="#9AA49C"
              />
            ) : advanceFee === null ? (
              'N/E'
            ) : (
              <Text
                fontSize="24px"
                fontWeight="500"
                lineHeight="30px"
                color="red"
              >
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
        </>
      ) : (
        <>
          <BasicInfoBox
            mt="4"
            label={t('Disponível para adiantamento')}
            icon={Checked}
            value={formatCurrency(advanceableValue ?? 0)}
          />
          <Box mt="6" w="100%" py="2" borderTop="1px solid #C8D7CB">
            <SectionTitle>
              {t('Informe o valor que deseja antecipar')}
            </SectionTitle>
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
          </Box>
        </>
      )}
    </FinancesBaseDrawer>
  );
};
