import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import React from 'react';
import { t } from 'utils/i18n';
import { BasicInfoBox } from './BasicInfoBox';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';
import { formatCents, formatIuguValueToDisplay } from './utils';

interface WithdrawsDrawerProps {
  isOpen: boolean;
  totalWithdraws?: number;
  withdrawValue?: string | null;
  requestWithdraw(): void;
  isLoading: boolean;
  isSuccess?: boolean;
  onClose(): void;
}

export const WithdrawsDrawer = ({
  onClose,
  totalWithdraws,
  withdrawValue,
  requestWithdraw,
  isLoading,
  isSuccess,
  ...props
}: WithdrawsDrawerProps) => {
  // state
  const [requestedValue, setRequestedValue] = React.useState<string | null>();
  const [withdrawsLeft, setWithdrawsLeft] = React.useState<number | null>();
  const [withdrawIsAvailable, setWithdrawIsAvailable] = React.useState<boolean>();
  // helpers
  // side effects
  React.useEffect(() => {
    if (!withdrawValue || totalWithdraws === undefined) return;
    const value = formatCents(withdrawValue);
    const withdrawsLeft = 4 - totalWithdraws;
    const isAvailable = value > 0 && withdrawsLeft > 0;
    setWithdrawsLeft(withdrawsLeft);
    setWithdrawIsAvailable(isAvailable);
    if (value > 0) setRequestedValue(withdrawValue);
  }, [withdrawValue, totalWithdraws]);
  // UI
  if (isSuccess) {
    return (
      <FinancesBaseDrawer onClose={onClose} title={t('Confirmação de Transferência')} {...props}>
        <Flex w="100%" h="100%" flexDir="column" justifyContent="center">
          <Box>
            <Icon as={Checked} w="36px" h="36px" />
            <Text mt="2" fontSize="24px" fontWeight="500" lineHeight="30px" color="black">
              {t('Transferência realizada com sucesso!')}
            </Text>
            <Text mt="1" fontSize="18px" fontWeight="500" lineHeight="26px">
              {t(
                `Em até 2 dias úteis o valor de ${
                  requestedValue ? formatIuguValueToDisplay(requestedValue) : 'N/E'
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
      <FinancesBaseDrawer onClose={onClose} title={t('Confirmação de Transferência')} {...props}>
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
            onClick={requestWithdraw}
            isLoading={isLoading}
            loadingText={t('Confirmando')}
            isDisabled={!withdrawIsAvailable}
          >
            {t('Confirmar transferência')}
          </Button>
        </Flex>
      )}
      {...props}
    >
      <Text fontSize="18px" fontWeight="500" lineHeight="28px">
        {t('Você possui ')}
        <Text as="span" color="black" fontWeight="700">
          {withdrawsLeft}
        </Text>
        {t(' transferências disponíveis este mês (de um total de 4).')} <br />
        {withdrawIsAvailable && t('Deseja confirmar a transferência do valor disponível abaixo?')}
      </Text>
      <BasicInfoBox
        mt="6"
        label={t('Total disponível para transferência')}
        icon={Checked}
        value={withdrawValue}
      />
    </FinancesBaseDrawer>
  );
};
