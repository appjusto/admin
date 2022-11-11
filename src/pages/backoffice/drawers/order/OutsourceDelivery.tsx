import { Order, OutsourceAccountType, WithId } from '@appjusto/types';
import { Box, Button, HStack, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useGetOutsourceDelivery } from 'app/api/order/useGetOutsourceDelivery';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  phoneFormatter,
  phoneMask,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface OutsouceDeliveryProps {
  order?: WithId<Order> | null;
}

export const OutsouceDelivery = ({ order }: OutsouceDeliveryProps) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const {
    getOutsourceDelivery,
    outsourceDeliveryResult,
    updateOutsourcingCourierInfos,
    updateOutsourcingCourierInfosResult,
  } = useGetOutsourceDelivery(order?.id);
  // state
  const [isOutsourcing, setIsOutsourcing] = React.useState<boolean>(false);
  const [outsourcingAccountType, setOutsourcingAccountType] =
    React.useState<OutsourceAccountType>('platform');
  const [additionalValue, setAdditionalValue] = React.useState(400);
  const [outsourcingCourierName, setOutsourcingCourierName] =
    React.useState('');
  const [outsourcingCourierPhone, setOutsourcingCourierPhone] =
    React.useState('');
  // helpers
  const isOrderActive = order?.status
    ? ['confirmed', 'preparing', 'ready', 'dispatching'].includes(order.status)
    : false;
  // handlers
  const handleOutsourcing = () => {
    let priorityFee;
    if (outsourcingAccountType === 'platform') {
      if (additionalValue > 0 && additionalValue < 400) {
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'Operação negada',
          message: {
            title: 'O valor mínimo de adicional é R$ 4,00.',
          },
        });
      }
      priorityFee =
        additionalValue > 0 ? (additionalValue / 100).toString() : undefined;
    }
    getOutsourceDelivery({ accountType: outsourcingAccountType, priorityFee });
  };
  const handleOutsourcingCourierInfos = () => {
    if (
      outsourcingCourierName.length === 0 ||
      outsourcingCourierPhone.length !== 11
    ) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'Operação negada',
        message: {
          title:
            'Favor informar corretamente o nome e o celular do entregador.',
        },
      });
    }
    const data = {
      name: outsourcingCourierName,
      phone: outsourcingCourierPhone,
    };
    updateOutsourcingCourierInfos(data);
  };
  // side effects
  React.useEffect(() => {
    if (order?.dispatchingStatus === 'outsourced') setIsOutsourcing(true);
  }, [order?.dispatchingStatus]);
  React.useEffect(() => {
    if (order?.dispatchingStatus === 'outsourced') {
      if (!order?.courier?.name) setOutsourcingCourierName('');
      else setOutsourcingCourierName(order?.courier?.name);
      if (!order?.courier?.phone) setOutsourcingCourierPhone('');
      else setOutsourcingCourierPhone(order?.courier?.phone);
    }
  }, [order?.dispatchingStatus, order?.courier]);
  // UI
  if (!isOutsourcing) {
    return (
      <Button
        display={
          userAbility?.can('update', { kind: 'orders', ...order })
            ? 'inline-block'
            : 'none'
        }
        h="38px"
        w="220px"
        size="sm"
        variant="yellowDark"
        onClick={() => setIsOutsourcing(true)}
        isDisabled={
          order?.dispatchingStatus
            ? ['matched', 'confirmed'].includes(order.dispatchingStatus)
            : true
        }
      >
        {t('Logística fora da rede')}
      </Button>
    );
  }
  return (
    <>
      {order?.dispatchingStatus === 'outsourced' ? (
        <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" bg="" p="4">
          <SectionTitle mt="0">
            {t('Logística fora da rede ativada')}
          </SectionTitle>
          <Text mt="4">
            {t('Responsável: ')}
            <Text as="span" fontWeight="700">
              {order.outsourcedBy === 'business'
                ? t('Restaurante')
                : t('Plataforma')}
            </Text>
          </Text>
          {isOrderActive && order.outsourcedBy !== 'business' && (
            <Text mt="2">
              {t(
                'Será necessário finalizar o pedido quando o mesmo for entregue.'
              )}
            </Text>
          )}
          <Text mt="4" fontWeight="700">
            {t('Dados do entregador')}
          </Text>
          <HStack mt="2">
            <CustomInput
              mt="0"
              id="out-courier-name"
              label={t('Nome *')}
              value={outsourcingCourierName ?? ''}
              onChange={(ev) => setOutsourcingCourierName(ev.target.value)}
            />
            <CustomPatternInput
              isRequired
              id="courier-phone"
              label={t('Celular *')}
              placeholder={t('Número do celular')}
              mask={phoneMask}
              parser={numbersOnlyParser}
              formatter={phoneFormatter}
              value={outsourcingCourierPhone}
              onValueChange={(value) => setOutsourcingCourierPhone(value)}
              validationLength={11}
            />
            <Button
              h="60px"
              onClick={handleOutsourcingCourierInfos}
              isLoading={updateOutsourcingCourierInfosResult.isLoading}
              isDisabled={!outsourcingCourierName || !isOrderActive}
            >
              {t('Salvar')}
            </Button>
          </HStack>
        </Box>
      ) : (
        <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" bg="" p="4">
          <SectionTitle mt="0">{t('Logística fora da rede')}</SectionTitle>
          <Text mt="2">
            {t(
              `Ao realizar a logística de entrega fora da rede, restaurante e consumidor não serão informados, pelo Admin/App, sobre a localização do entregador.`
            )}
          </Text>
          <HStack
            mt="6"
            spacing={4}
            bgColor="#f6f6f67b"
            borderRadius="lg"
            p="4"
          >
            <Text fontWeight="700">
              {t(`O valor da entrega será destinado para:`)}
            </Text>
            <RadioGroup
              onChange={(value: OutsourceAccountType) =>
                setOutsourcingAccountType(value)
              }
              value={outsourcingAccountType}
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <HStack spacing={6}>
                <Radio value="platform">{t('Plataforma')}</Radio>
                <Radio value="business" isDisabled={order?.type === 'p2p'}>
                  {t('Restaurante')}
                </Radio>
              </HStack>
            </RadioGroup>
          </HStack>
          {outsourcingAccountType === 'platform' && (
            <Box mt="2">
              <CurrencyInput
                mt="0"
                id="outsource-priority-fee"
                label={t('Valor extra adicionado')}
                value={additionalValue}
                onChangeValue={setAdditionalValue}
                maxLength={6}
              />
            </Box>
          )}
          <HStack mt="6" justifyContent="flex-end">
            <Button
              mt="0"
              variant="dangerLight"
              onClick={() => setIsOutsourcing(false)}
            >
              {t('Cancelar')}
            </Button>
            <Button
              mt="0"
              onClick={handleOutsourcing}
              isLoading={outsourceDeliveryResult.isLoading}
            >
              {t('Confirmar')}
            </Button>
          </HStack>
        </Box>
      )}
    </>
  );
};
