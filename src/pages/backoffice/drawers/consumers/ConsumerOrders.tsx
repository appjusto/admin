import { Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { t } from 'utils/i18n';

interface ItemPros {
  code: string;
  createdOn: string;
  business: string;
  value: string;
}

const ConsumerOrdersTableItem = ({ code, createdOn, business, value }: ItemPros) => {
  return (
    <Tr color="black" fontSize="xs" fontWeight="700">
      <Td>{code}</Td>
      <Td>{createdOn}</Td>
      <Td>{business}</Td>
      <Td>{value}</Td>
    </Tr>
  );
};

export const ConsumerOrders = () => {
  // context
  const { consumer } = useContextConsumerProfile();

  // helpers
  const totalOrders = consumer?.statistics?.totalOrders ?? '0';
  return (
    <>
      <Text fontSize="20px" lineHeight="26px" color="black">
        {`${totalOrders} pedidos realizados`}
      </Text>
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('ID')}</Th>
            <Th>{t('Data do onboarding')}</Th>
            <Th>{t('Restaurante')}</Th>
            <Th>{t('Valor')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Não há pedidos no momento.')}</Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
};
