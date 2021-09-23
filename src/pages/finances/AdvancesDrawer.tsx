import { Box, Button, Checkbox, CheckboxGroup, Flex, Icon, Skeleton, Text } from '@chakra-ui/react';
import { useAdvanceReceivables } from 'app/api/business/useAdvanceReceivables';
import { useReceivables } from 'app/api/business/useReceivables';
import { useReceivablesSimulation } from 'app/api/business/useReceivablesSimulation';
import { FirebaseError } from 'app/api/types';
import { useContextBusinessId } from 'app/state/business/context';
import { IuguMarketplaceAccountReceivableItem } from 'appjusto-types/payment/iugu';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { BasicInfoBox } from './BasicInfoBox';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';
import { formatIuguDateToDisplay, formatIuguValueToDisplay } from './utils';

interface WithdrawalsDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const AdvancesDrawer = ({ onClose, ...props }: WithdrawalsDrawerProps) => {
  // context
  const businessId = useContextBusinessId();
  const { receivables } = useReceivables(businessId);
  const { advanceReceivables, advanceReceivablesResult } = useAdvanceReceivables(businessId);
  const { isLoading, isSuccess, isError, error: receivalbesError } = advanceReceivablesResult;
  // state
  const [items, setItems] = React.useState<IuguMarketplaceAccountReceivableItem[]>([]);
  const [selectedAll, setSelectedAll] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [isReviewing, setIsReviewing] = React.useState(false);
  const [totalAvailable, setTotalAvailable] = React.useState<string>();
  const [totalSelected, setTotalSelected] = React.useState<string>();
  const [isFeesAccepted, setIsFeesAccepted] = React.useState(false);
  const { advancedValue, advanceFee, receivedValue } = useReceivablesSimulation(
    businessId,
    selected
  );
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
  const acceptCheckBoxRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const handleReceivablesRequest = async () => {
    setError(initialError);
    submission.current += 1;
    if (selected.length === 0)
      return setError({
        status: true,
        error: null,
        message: { title: 'Nenhum valor foi selecionado para antecipação' },
      });
    if (!isReviewing) return setIsReviewing(true);
    if (!isFeesAccepted) {
      acceptCheckBoxRef.current?.focus();
      return setError({
        status: true,
        error: null,
        message: { title: 'É preciso aceitar os valores informados na simulação.' },
      });
    }
    // for withdraws
    //let amount = convertBalance(receivedValue);
    const ids = selected.map((id) => parseInt(id));
    await advanceReceivables(ids);
  };
  // side effects
  React.useEffect(() => {
    if (receivables?.items) {
      setItems(receivables.items);
      const total = receivables.items.reduce<number>((result, item) => {
        let value = 0;
        if (item.total.includes('R$'))
          value = parseFloat(item.total.split(' ')[1].replace(',', '.')) * 100;
        else value = parseFloat(item.total.split(' ')[0].replace(',', '.')) * 100;
        return (result += value);
      }, 0);
      setTotalAvailable(formatCurrency(total));
    } else setItems([]);
  }, [receivables]);
  React.useEffect(() => {
    if (items.length === 0) return;
    const itemsSelected = items.filter((item) => selected.includes(item.id.toString()));
    const total = itemsSelected.reduce<number>((result, item) => {
      let value = 0;
      if (item.total.includes('R$'))
        value = parseFloat(item.total.split(' ')[1].replace(',', '.')) * 100;
      else value = parseFloat(item.total.split(' ')[0].replace(',', '.')) * 100;
      return (result += value);
    }, 0);
    setTotalSelected(formatCurrency(total));
  }, [items, selected]);
  React.useEffect(() => {
    if (selectedAll) setSelected(items.map((item) => item.id.toString()));
    //else setSelected([]);
  }, [items, selectedAll]);
  React.useEffect(() => {
    if (items.length === 0) return;
    if (selected.length !== items.length) setSelectedAll(false);
    else setSelectedAll(true);
  }, [items, selected]);
  React.useEffect(() => {
    if (isError) {
      const errorMessage = (receivalbesError as FirebaseError).message;
      setError({
        status: true,
        error: receivalbesError,
        message: { title: errorMessage },
      });
    }
  }, [isError, receivalbesError]);
  // UI
  if (isSuccess) {
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
            <Text mt="2" fontSize="24px" fontWeight="500" lineHeight="30px" color="black">
              {t('Antecipação realizada com sucesso!')}
            </Text>
            <Text mt="1" fontSize="18px" fontWeight="500" lineHeight="26px">
              {t(
                `Em até 1 dia útil o valor de ${formatIuguValueToDisplay(
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
        'O prazo padrão para faturar os pagamentos é de 30 dias. Se quiser, você pode selecionar os valores disponíveis abaixo e realizar a antecipação, pagando uma taxa de até 2.5% por operação (taxa proporcional ao tempo que falta para completar 30 dias). Nada desse dinheiro ficará com o AppJusto.'
      )}
      isReviewing={isReviewing}
      footer={() => (
        <Flex w="100%" justifyContent="space-between">
          <Button
            minW="220px"
            fontSize="15px"
            onClick={handleReceivablesRequest}
            isLoading={isLoading}
            loadingText={t('Confirmando')}
          >
            {isReviewing ? t('Confirmar adiantamento') : t('Revisar adiantamento')}
          </Button>
          {isReviewing && (
            <Button mr="16" fontSize="15px" variant="outline" onClick={() => setIsReviewing(false)}>
              {t('Voltar')}
            </Button>
          )}
        </Flex>
      )}
      {...props}
    >
      {isReviewing ? (
        <>
          <Box mt="2">
            <Text fontSize="15px" fontWeight="500" lineHeight="21px">
              {t('Você selecionou')}
            </Text>
            <Text fontSize="24px" fontWeight="500" lineHeight="30px">
              {selected.length} pedidos
            </Text>
          </Box>
          <Box mt="6">
            <Text fontSize="15px" fontWeight="500" lineHeight="21px">
              {t('Total a adiantar')}
            </Text>
            {advancedValue === undefined ? (
              <Skeleton mt="1" maxW="294px" height="30px" colorScheme="#9AA49C" />
            ) : advancedValue === null ? (
              'N/E'
            ) : (
              <Text fontSize="24px" fontWeight="500" lineHeight="30px" color="green.700">
                + {formatIuguValueToDisplay(advancedValue)}
              </Text>
            )}
          </Box>
          <Box mt="6">
            <Text fontSize="15px" fontWeight="500" lineHeight="21px">
              {t('Total de taxas de adiantamento')}
            </Text>
            {advanceFee === undefined ? (
              <Skeleton mt="1" maxW="294px" height="30px" colorScheme="#9AA49C" />
            ) : advanceFee === null ? (
              'N/E'
            ) : (
              <Text fontSize="24px" fontWeight="500" lineHeight="30px" color="red">
                - {formatIuguValueToDisplay(advanceFee)}
              </Text>
            )}
          </Box>
          <BasicInfoBox
            mt="6"
            label={t('Total a receber no adiantamento')}
            icon={Checked}
            value={receivedValue}
          />
          <Checkbox
            ref={acceptCheckBoxRef}
            mt="6"
            size="lg"
            borderColor="black"
            borderRadius="lg"
            colorScheme="green"
            isChecked={isFeesAccepted}
            onChange={(e) => setIsFeesAccepted(e.target.checked)}
          >
            <Text fontSize="15px" fontWeight="500" lineHeight="21px">
              {t('Estou de acordo com as taxas cobradas para o adiantamento do valor')}
            </Text>
          </Checkbox>
        </>
      ) : (
        <>
          <BasicInfoBox
            label={t('Disponível para adiantamento')}
            icon={Checked}
            value={totalAvailable}
          />
          <Box mt="6" w="100%" py="2" borderBottom="1px solid #C8D7CB">
            <Checkbox
              size="lg"
              colorScheme="green"
              borderColor="black"
              isChecked={selectedAll}
              onChange={(e) => setSelectedAll(e.target.checked)}
            >
              <Text color="black" fontSize="15px" lineHeight="21px" fontWeight="700">
                {t('Selecionar todos')}
              </Text>
            </Checkbox>
          </Box>
          <Box mt="4">
            <CheckboxGroup
              colorScheme="green"
              value={selected}
              onChange={(values: string[]) => setSelected(values)}
            >
              {items.map((item) => (
                <Box key={item.id} w="100%" py="4" borderBottom="1px solid #C8D7CB">
                  <Checkbox size="lg" value={item.id.toString()} borderColor="black">
                    <Box ml="4">
                      <Text fontSize="15px" fontWeight="500" lineHeight="21px" color="black">
                        {formatIuguValueToDisplay(item.total)}
                      </Text>
                      <Text mt="2" fontSize="15px" fontWeight="500" lineHeight="21px">
                        {t('Será faturado em: ') + formatIuguDateToDisplay(item.scheduled_date)}
                      </Text>
                    </Box>
                  </Checkbox>
                </Box>
              ))}
            </CheckboxGroup>
            <Text mt="4" fontSize="15px" fontWeight="700" lineHeight="21px">
              {t(`Total selecionado: ${totalSelected ?? 'R$ 0,00'}`)}
            </Text>
          </Box>
        </>
      )}
      <SuccessAndErrorHandler
        submission={submission.current}
        //isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </FinancesBaseDrawer>
  );
};
