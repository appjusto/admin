import { Button, Flex, Text } from '@chakra-ui/react';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import React from 'react';
import { t } from 'utils/i18n';
import { BasicInfoBox } from './BasicInfoBox';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';

interface WithdrawsDrawerProps {
  isOpen: boolean;
  totalWithdraws?: number;
  withdrawValue?: string | null;
  requestWithdraw(): void;
  isLoading: boolean;
  onClose(): void;
}

export const WithdrawsDrawer = ({
  onClose,
  totalWithdraws,
  withdrawValue,
  requestWithdraw,
  isLoading,
  ...props
}: WithdrawsDrawerProps) => {
  // context
  // state
  // helpers
  const withdrawsLeft = totalWithdraws ? 4 - totalWithdraws : 'N/E';
  // side effects
  // UI
  return (
    <FinancesBaseDrawer
      onClose={onClose}
      title={t('Confirmação de Transferência')}
      footer={
        <Flex w="100%" justifyContent="flex-start">
          <Button
            minW="220px"
            fontSize="15px"
            onClick={requestWithdraw}
            isLoading={isLoading}
            loadingText={t('Confirmando')}
          >
            {t('Confirmar transferência')}
          </Button>
        </Flex>
      }
      {...props}
    >
      <Text fontSize="18px" fontWeight="500" lineHeight="28px">
        {t('Você possui ')}
        <Text as="span" color="black" fontWeight="700">
          {withdrawsLeft}
        </Text>
        {t(' transferências disponíveis este mês (de um total de 4).')} <br />
        {t('Deseja confirmar a transferência do valor disponível abaixo?')}
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
