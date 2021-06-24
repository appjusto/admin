import {
  Box,
  Flex,
  HStack,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { Order, OrderItem, WithId } from 'appjusto-types';
import logoAppjusto from 'common/img/logo.svg';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../../backoffice/drawers/generics/SectionTitle';
interface OrderToPrintProps {
  businessName?: string;
  order?: WithId<Order> | null;
}

export const OrderToPrint = React.forwardRef<HTMLDivElement, OrderToPrintProps>(
  ({ businessName, order }, ref) => {
    // context
    const { logo } = useBusinessProfile();
    // UI
    return (
      <Box ref={ref} maxW="300px" p="4" position="absolute" top="0" left="0" zIndex="-999">
        <Flex flexDir="column" alignItems="center">
          <HStack spacing={2} alignItems="center">
            <Box maxW="30px" borderRadius="15px" overflow="hidden">
              <Image src={logo ?? ''} />
            </Box>
            <Box maxW="40px" borderRadius="20px" overflow="hidden">
              <Image src={logoAppjusto} />
            </Box>
          </HStack>
          <Text mt="1" color="black" fontSize="xs" fontWeight="700" lineHeight="14px">
            {businessName}
          </Text>
          <Text mt="0" fontSize="10px">
            {t('Por um delivery mais justo e transparente!')}
          </Text>
        </Flex>
        <Text mt="4" color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
          {t('Pedido Nº')} {order?.code}
        </Text>
        <Text fontSize="12px" color="gray.600" fontWeight="500" lineHeight="16px">
          {t('Cliente:')}{' '}
          <Text as="span" color="black" fontWeight="700">
            {order?.consumer?.name ?? 'N/E'}
          </Text>
        </Text>
        <Text fontSize="12px" color="gray.600" fontWeight="500" lineHeight="16px">
          {t('Hora:')}{' '}
          <Text as="span" color="black" fontWeight="700">
            {getDateAndHour(order?.confirmedOn)}
          </Text>
        </Text>
        <Text fontSize="12px" color="gray.600" fontWeight="500" lineHeight="16px">
          {t('Endereço:')}{' '}
          <Text as="span" color="black" fontWeight="700">
            {order?.destination?.address.main ?? 'N/E'}
          </Text>
        </Text>
        <Text fontSize="12px" color="gray.600" fontWeight="500" lineHeight="16px">
          {t('Complemento:')}{' '}
          <Text as="span" color="black" fontWeight="700">
            {order?.destination?.additionalInfo ?? 'N/I'}
          </Text>
        </Text>
        <SectionTitle mt="2" fontSize="18px">
          {t('Detalhes do pedido')}
        </SectionTitle>
        <Table mt="2" size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>{t('Item')}</Th>
              <Th isNumeric>{t('Qtd.')}</Th>
              <Th isNumeric>{t('Valor')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {order?.items?.map((item: OrderItem) => (
              <React.Fragment key={Math.random()}>
                <Tr color="black" fontWeight="700">
                  <Td fontSize="13px">
                    {item.product.name} <br />
                    <Text as="span" fontSize="11px" fontWeight="500">
                      {item.notes}
                    </Text>
                  </Td>
                  <Td isNumeric fontSize="13px">
                    {item.quantity}
                  </Td>
                  <Td isNumeric fontSize="13px">
                    {formatCurrency(item.product.price)}
                  </Td>
                </Tr>
                {item.complements &&
                  item.complements.map((complement) => (
                    <Tr key={Math.random()} mt="-20px" color="black">
                      <Td fontSize="12px" fontWeight="500">
                        {complement.name}
                      </Td>
                      <Td isNumeric fontSize="12px" fontWeight="500">
                        {item.quantity}
                      </Td>
                      <Td isNumeric fontSize="12px" fontWeight="500">
                        {formatCurrency(complement.price)}
                      </Td>
                    </Tr>
                  ))}
              </React.Fragment>
            ))}
          </Tbody>
          <Tfoot bgColor="gray.50">
            <Tr color="black">
              <Th>{t('Total')}</Th>
              <Th></Th>
              <Th isNumeric>
                {order?.fare?.business?.value ? formatCurrency(order.fare.business.value) : 0}
              </Th>
            </Tr>
          </Tfoot>
        </Table>
        <SectionTitle mt="2" fontSize="18px">
          {t('Observações')}
        </SectionTitle>
        {order?.additionalInfo ? (
          <Text mt="1" fontSize="12px">
            {order?.additionalInfo}
          </Text>
        ) : (
          <Text mt="1" fontSize="12px">
            {t('Sem observações.')}
          </Text>
        )}
      </Box>
    );
  }
);
