import { Box, Checkbox, CheckboxGroup, Flex, Icon, Skeleton, Text } from '@chakra-ui/react';
import { useReceivables } from 'app/api/business/useReceivables';
import { useReceivablesSimulation } from 'app/api/business/useReceivablesSimulation';
import { useContextBusinessId } from 'app/state/business/context';
import { IuguMarketplaceAccountReceivableItem } from 'appjusto-types/payment/iugu';
import { ReactComponent as Checked } from 'common/img/icon-checked.svg';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { BasicInfoBox } from './BasicInfoBox';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';

/*const fakeInvoices = [
  {
    id: '1',
    value: 'R$ 48,00',
    date: '10/09/2021',
  },
  {
    id: '2',
    value: 'R$ 58,00',
    date: '10/09/2021',
  },
  {
    id: '3',
    value: 'R$ 34,50',
    date: '09/09/2021',
  },
  {
    id: '4',
    value: 'R$ 62,80',
    date: '09/09/2021',
  },
];*/

interface WithdrawalsDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const WithdrawalsDrawer = ({ onClose, ...props }: WithdrawalsDrawerProps) => {
  // context
  const businessId = useContextBusinessId();
  const { receivables } = useReceivables(businessId);
  // state
  const [items, setItems] = React.useState<IuguMarketplaceAccountReceivableItem[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [isReviewing, setIsReviewing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [totalAvailable, setTotalAvailable] = React.useState<string>();
  const [totalSelected, setTotalSelected] = React.useState<string>();
  const { advancedValue, advanceFee, receivedValue } = useReceivablesSimulation(
    businessId,
    selected
  );
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
    if (!items) return;
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
  // UI
  if (isSuccess) {
    return (
      <FinancesBaseDrawer
        onClose={onClose}
        title={t('Antecipação dos valores')}
        isReviewing={isReviewing}
        setIsReviewing={setIsReviewing}
        {...props}
      >
        <Flex w="100%" h="100%" flexDir="column" justifyContent="center">
          <Box>
            <Icon as={Checked} w="36px" h="36px" />
            <Text mt="2" fontSize="24px" fontWeight="500" lineHeight="30px" color="black">
              {t('Antecipação realizada com sucesso!')}
            </Text>
            <Text mt="1" fontSize="18px" fontWeight="500" lineHeight="26px">
              {t('Em até 1 dia útil o valor de R$ 000,00 estará disponível para saque.')}
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
        'Você pode escolher individualmente os valores dos pedidos que deseja antecipar. Para realizar a antecipação, será cobrada uma taxa de 0.0% + R$ 0.00 pela operação financeira. Nada desse dinheiro ficará com o AppJusto.'
      )}
      isReviewing={isReviewing}
      setIsReviewing={setIsReviewing}
      pimaryFunc={() => setIsSuccess(true)}
      {...props}
    >
      {isReviewing ? (
        <>
          <Box mt="6">
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
              <Skeleton mt="1" height="30px" colorScheme="#9AA49C" />
            ) : advancedValue === null ? (
              'N/E'
            ) : (
              <Text fontSize="24px" fontWeight="500" lineHeight="30px" color="green.700">
                + {advancedValue}
              </Text>
            )}
          </Box>
          <Box mt="6">
            <Text fontSize="15px" fontWeight="500" lineHeight="21px">
              {t('Total de taxas de adiantamento')}
            </Text>
            {advanceFee === undefined ? (
              <Skeleton mt="1" height="30px" colorScheme="#9AA49C" />
            ) : advanceFee === null ? (
              'N/E'
            ) : (
              <Text fontSize="24px" fontWeight="500" lineHeight="30px" color="red">
                - {advanceFee}
              </Text>
            )}
          </Box>
          <BasicInfoBox
            label={t('Total a receber no adiantamento')}
            icon={Checked}
            value={receivedValue}
          />
          <Checkbox mt="6" size="lg" borderColor="black" borderRadius="lg" colorScheme="green">
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
          <Box mt="4">
            <CheckboxGroup
              colorScheme="green"
              value={selected}
              onChange={(values: string[]) => setSelected(values)}
            >
              {items.map((item) => (
                <Box key={item.id} w="100%" py="4" borderBottom="1px solid #C8D7CB">
                  <Checkbox size="lg" value={item.id.toString()}>
                    <Box ml="4">
                      <Text fontSize="15px" fontWeight="500" lineHeight="21px" color="black">
                        {item.total}
                      </Text>
                      <Text mt="2" fontSize="15px" fontWeight="500" lineHeight="21px">
                        {item.scheduled_date}
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
    </FinancesBaseDrawer>
  );
};
