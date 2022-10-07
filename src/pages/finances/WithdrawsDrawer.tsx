import { Box, Button, Checkbox, Flex, Icon, Text } from '@chakra-ui/react';
import { useRequestWithdraw } from 'app/api/business/useRequestWithdraw';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { convertBalance, formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { ReviewBox } from './advances/ReviewBox';
import { BasicInfoBox } from './BasicInfoBox';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';
import { formatCents, formatIuguValueToDisplay } from './utils';

interface WithdrawsDrawerProps {
  isOpen: boolean;
  withdrawValue?: string | null;
  onClose(): void;
}

const iuguFee: number = 200;

export const WithdrawsDrawer = ({
  onClose,
  withdrawValue,
  ...props
}: WithdrawsDrawerProps) => {
  // context
  const businessId = useContextBusinessId();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { requestWithdraw, requestWithdrawResult } =
    useRequestWithdraw(businessId);
  const { isLoading, isSuccess } = requestWithdrawResult;
  // state
  const [requestedValue, setRequestedValue] = React.useState(0);
  const [withdrawIsAvailable, setWithdrawIsAvailable] =
    React.useState<boolean>();
  const [isFeesAccepted, setIsFeesAccepted] = React.useState(false);
  // refs
  const acceptCheckBoxRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const handleWithdrawRequest = () => {
    if (!withdrawValue)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'FinancesPage-valid',
        message: { title: 'Não existe valor disponível para transferência.' },
      });
    const amount = convertBalance(withdrawValue);
    requestWithdraw(amount);
  };
  // side effects
  React.useEffect(() => {
    if (!withdrawValue) return;
    const value = formatCents(withdrawValue);
    setWithdrawIsAvailable(value > 0);
    const netValue = value - iuguFee;
    if (value > 0) setRequestedValue(netValue);
  }, [withdrawValue]);
  // UI
  if (isSuccess) {
    return (
      <FinancesBaseDrawer
        onClose={onClose}
        title={t('Confirmação de Transferência')}
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
              {t('Transferência realizada com sucesso!')}
            </Text>
            <Text mt="1" fontSize="18px" fontWeight="500" lineHeight="26px">
              {t(
                `Em até 2 dias úteis o valor de ${
                  requestedValue ? formatCurrency(requestedValue) : 'N/E'
                } estará disponível em sua conta.`
              )}
            </Text>
          </Box>
        </Flex>
      </FinancesBaseDrawer>
    );
  }
  if (withdrawIsAvailable === undefined) {
    return (
      <FinancesBaseDrawer
        onClose={onClose}
        title={t('Confirmação de Transferência')}
        {...props}
      >
        <Text fontSize="18px" fontWeight="500" lineHeight="28px">
          {t('Carregando informações...')}
        </Text>
        <BasicInfoBox
          mt="6"
          label={t('Total disponível para transferência')}
          icon={Checked}
          value={withdrawValue}
        />
      </FinancesBaseDrawer>
    );
  }
  return (
    <FinancesBaseDrawer
      onClose={onClose}
      title={t('Confirmação de Transferência')}
      footer={() => (
        <Flex w="100%" justifyContent="flex-start">
          <Button
            minW="220px"
            fontSize="15px"
            onClick={handleWithdrawRequest}
            isLoading={isLoading}
            loadingText={t('Confirmando')}
            isDisabled={!withdrawIsAvailable || !isFeesAccepted}
          >
            {t('Confirmar transferência')}
          </Button>
        </Flex>
      )}
      {...props}
    >
      <Text fontSize="18px" fontWeight="500" lineHeight="28px">
        {t(
          'Abaixo são exibidos os valores referentes à operação. Para prosseguir com a transferência, basta marcar que está de acordo com a taxa cobrada pela Iugu e confirmar.'
        )}
      </Text>
      <Flex mt="4" flexDir="row">
        <Icon mt="1" as={MdInfoOutline} />
        <Text ml="2" fontSize="15px" fontWeight="500" lineHeight="22px">
          {t(
            `Agora você pode realizar quantos saques desejar, ao longo do mês, porém a Iugu passou a cobrar uma taxa fixa de ${formatCurrency(
              iuguFee
            )} por operação.`
          )}
        </Text>
      </Flex>
      <Box mt="8">
        <Text fontSize="15px" fontWeight="500" lineHeight="21px">
          {t('Valor disponível:')}
        </Text>
        <Text fontSize="24px" fontWeight="500" lineHeight="30px">
          {formatIuguValueToDisplay(withdrawValue)}
        </Text>
      </Box>
      <ReviewBox
        label={t('Taxas de transferência (Iugu)')}
        valueToDisplay={iuguFee}
        signal="-"
      />
      <BasicInfoBox
        mt="6"
        label={t('Total a ser transferido')}
        icon={Checked}
        value={formatCurrency(requestedValue)}
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
            'Estou de acordo com a taxa cobrada para a transferência do valor.'
          )}
        </Text>
      </Checkbox>
    </FinancesBaseDrawer>
  );
};
