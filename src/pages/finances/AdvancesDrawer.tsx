import { IuguMarketplaceAccountReceivableItem } from '@appjusto/types/payment/iugu';
import { Box, Button, Checkbox, CheckboxGroup, Flex, Icon, Skeleton, Text } from '@chakra-ui/react';
import { useAdvanceReceivables } from 'app/api/business/useAdvanceReceivables';
import { useReceivables } from 'app/api/business/useReceivables';
import { useReceivablesSimulation } from 'app/api/business/useReceivablesSimulation';
import { useCanAdvanceReceivables } from 'app/api/platform/useCanAdvanceReceivables';
import { useContextBusinessId } from 'app/state/business/context';
import { useOrdersContext } from 'app/state/order';
import { useContextAppRequests } from 'app/state/requests/context';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import dayjs from 'dayjs';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { BasicInfoBox } from './BasicInfoBox';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';
import { formatCents, formatIuguDateToDisplay, formatIuguValueToDisplay } from './utils';

interface WithdrawalsDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const AdvancesDrawer = ({ onClose, ...props }: WithdrawalsDrawerProps) => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const businessId = useContextBusinessId();
  const { platformParams } = useOrdersContext();
  const { receivables } = useReceivables(businessId);
  const { advanceReceivables, advanceReceivablesResult } = useAdvanceReceivables(businessId);
  const { isLoading, isSuccess } = advanceReceivablesResult;
  const canAdvanceReceivables = useCanAdvanceReceivables();
  const advanceableAfterHours = platformParams?.marketplace.advances.advanceableAfterHours ?? 48;
  // state
  const [items, setItems] = React.useState<IuguMarketplaceAccountReceivableItem[]>([]);
  const [advanceables, setAdvanceables] = React.useState<IuguMarketplaceAccountReceivableItem[]>(
    []
  );
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
  // refs
  const acceptCheckBoxRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const advanceableAt = (createdAt: string) => {
    const date = dayjs(createdAt).add(advanceableAfterHours, 'hour').toDate();
    const monthNum = date.getMonth() + 1;
    const monthStr = monthNum > 9 ? monthNum : `0${monthNum}`;
    return `${date.getFullYear()}-${monthStr}-${date.getDate()}`;
  };
  const handleReceivablesRequest = async () => {
    if (selected.length === 0)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AdvancesDrawer-valid-no-value',
        message: { title: 'Nenhum valor foi selecionado para antecipação' },
      });
    if (!isReviewing) return setIsReviewing(true);
    if (!isFeesAccepted) {
      acceptCheckBoxRef.current?.focus();
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'AdvancesDrawer-valid-agreement',
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
      const canBeSelected = receivables.items.filter((item) => item.advanceable);
      setAdvanceables(canBeSelected);
    } else setItems([]);
  }, [receivables]);
  React.useEffect(() => {
    if (!advanceables) return;
    const total = advanceables.reduce<number>((result, item) => {
      let value = item.total ? formatCents(item.total) : 0;
      return (result += value);
    }, 0);
    setTotalAvailable(formatCurrency(total));
  }, [advanceables]);

  React.useEffect(() => {
    if (advanceables.length === 0) return;
    const itemsSelected = advanceables.filter((item) => selected.includes(item.id.toString()));
    const total = itemsSelected.reduce<number>((result, item) => {
      let value = item.total ? formatCents(item.total) : 0;
      return (result += value);
    }, 0);
    setTotalSelected(formatCurrency(total));
  }, [advanceables, selected]);
  React.useEffect(() => {
    if (selectedAll) setSelected(advanceables.map((item) => item.id.toString()));
    // else setSelected([]);
  }, [advanceables, selectedAll]);
  React.useEffect(() => {
    if (advanceables.length === 0) return;
    if (selected.length === 0 || selected.length !== advanceables.length) setSelectedAll(false);
    else setSelectedAll(true);
  }, [advanceables, selected]);
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
            loadingText={t('Confirmando')}
            isDisabled={!canAdvanceReceivables || selected.length === 0}
          >
            {isReviewing
              ? t('Confirmar adiantamento')
              : canAdvanceReceivables
              ? t('Revisar adiantamento')
              : t('Fora do horário')}
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
      <Text mt="-2" color="red">
        {t(
          'Atenção: a Iugu só permite realizar antecipações em dias úteis, de 09:00 às 16:00 e só é possível antecipar faturas pagas há mais de 2 dias úteis.'
        )}
      </Text>
      {isReviewing ? (
        <>
          <Box mt="4">
            <Text fontSize="15px" fontWeight="500" lineHeight="21px">
              {t('Você selecionou')}
            </Text>
            <Text fontSize="24px" fontWeight="500" lineHeight="30px">
              {selected.length} {selected.length > 1 ? t('pedidos') : t('pedido')}
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
            mt="4"
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
              onChange={(e) => {
                if (e.target.checked) setSelectedAll(e.target.checked);
                else setSelected([]);
              }}
              isDisabled={advanceables.length === 0}
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
                  <Checkbox
                    size="lg"
                    value={item.id.toString()}
                    borderColor="black"
                    isDisabled={!item.advanceable}
                  >
                    <Box ml="4">
                      <Text fontSize="15px" fontWeight="500" lineHeight="21px" color="black">
                        {formatIuguValueToDisplay(item.total)}
                      </Text>
                      <Text mt="2" fontSize="15px" fontWeight="500" lineHeight="21px">
                        {t('Será faturado em: ') + formatIuguDateToDisplay(item.scheduled_date)}
                      </Text>
                      {!item.advanceable && (
                        <Text mt="2" fontSize="15px" fontWeight="500" lineHeight="21px">
                          {t('Disponível após: ') +
                            formatIuguDateToDisplay(advanceableAt(item.created_at))}
                        </Text>
                      )}
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
    </FinancesBaseDrawer>
  );
};
