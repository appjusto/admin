import { Box, Button, HStack } from '@chakra-ui/react';
import { CustomInput } from 'common/components/form/input/CustomInput';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';
import { OrdersHistoryTable } from './OrdersHistoryTable';

export const OrdersHistory = () => {
  // context
  const { orders } = useOrdersContext();
  // state
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [orderNumber, setOrderNumber] = React.useState('');
  const [clientName, setClientName] = React.useState('');
  return (
    <Box>
      <PageHeader
        title={t('Histórico de pedidos')}
        subtitle={t(
          'Veja aqui os pedidos feitos em seu restaurante. Nesta página você pode também cancelar pedidos.'
        )}
        maxW="700px"
      />
      <HStack mt="4" spacing="4">
        <CustomInput
          mt="0"
          id="from"
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          label={t('De')}
          placeholder={t('De')}
        />
        <CustomInput
          id="to"
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          label={t('Até')}
          placeholder={t('Até')}
        />
        <CustomInput
          id="order-number"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          label={t('Número')}
          placeholder={t('Número do pedido')}
        />
        <CustomInput
          id="from"
          value={clientName}
          onChange={(event) => setClientName(event.target.value)}
          label={t('Nome')}
          placeholder={t('Nome do cliente')}
        />
      </HStack>
      <HStack mt="4" spacing="4">
        <Button minW="198.25px" fontSize="sm" lineHeight="21px">
          {t('Filtrar resultados')}
        </Button>
        <Button minW="198.25px" fontSize="sm" lineHeight="21px" variant="outline">
          {t('Exportar lista  (.csv)')}
        </Button>
      </HStack>
      <OrdersHistoryTable orders={orders} />
    </Box>
  );
};
