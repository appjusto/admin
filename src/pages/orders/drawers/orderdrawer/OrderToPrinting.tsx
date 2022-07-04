import { Order, OrderItem, WithId } from '@appjusto/types';
import {
  Box,
  Flex,
  HStack,
  Image, Text
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import logoAppjusto from 'common/img/logo-black.svg';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../../backoffice/drawers/generics/SectionTitle';
interface OrderToPrintProps {
  businessName?: string;
  order?: WithId<Order> | null;
}

const renderItems = (items?: OrderItem[]) => {
  if(items) return items.map(item => {
    return (
      <Box key={item.id} mb="2">
          <Flex flexDir="row" fontWeight="700">
            <Box w="10%">{item.quantity}</Box>
            <Box w="60%">
              <Text>
                {item.product.name}
              </Text>
            </Box>
            <Box w="30%" textAlign="end">
              {formatCurrency(item.product.price)}
            </Box>
          </Flex>
          {item.complements && item.complements.map(complement => {
            return (
              <Flex key={complement.name} flexDir="row">
                <Box w="10%"></Box>
                <HStack w="60%" spacing={2}>
                  <Text>
                    {complement.quantity ?? 1}
                  </Text>
                  <Text>
                    {complement.name ?? 'N/E'}
                  </Text>
                </HStack>
                <Box w="30%" textAlign="end">
                  {formatCurrency(complement.price)}
                </Box>
              </Flex>
            )
          })}
          {
            item.notes && (
              <Flex flexDir="row">
                <Box w="10%"></Box>
                <Box w="90%">
                  <Text fontWeight="500">
                    Obs: {item.notes.toUpperCase()}
                  </Text>
                </Box>
              </Flex>
            )
          }
        </Box>
    )
  })
}

export const OrderToPrinting = React.forwardRef<HTMLDivElement, OrderToPrintProps>(
  ({ businessName, order }, ref) => {
    // context
    const { logo } = useBusinessProfile();
    // helpers
    const isAdditional = order?.destination?.additionalInfo && order.destination.additionalInfo.length > 0;
    // UI - Hidden
    return (
      <Box
        ref={ref}
        maxW="300px"
        p="4"
        position="absolute"
        top="0"
        left="0"
        fontFamily="Tahoma"
        fontSize="12px"
        color="black"
        zIndex="-999"
      >
        <Flex flexDir="column" alignItems="center">
          <HStack spacing={2} alignItems="center">
            <Box maxW="60px">
              <Image src={logo ?? ''} />
            </Box>
            <Box maxW="80px">
              <Image src={logoAppjusto} />
            </Box>
          </HStack>
          <Text fontSize="11px">{t('Por um delivery mais justo e transparente!')}</Text>
          <Text mt="4" fontSize="xs" fontWeight="700" lineHeight="14px">
            {businessName}
          </Text>
        </Flex>
        <Text mt="4" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
          {t('Pedido Nº')} {order?.code}
        </Text>
        <Text fontWeight="500" lineHeight="16px">
          {t('Cliente:')}{' '}
          <Text as="span" fontWeight="700">
            {order?.consumer?.name ?? 'N/E'}
          </Text>
        </Text>
        <Text fontWeight="500" lineHeight="16px">
          {t('Hora:')}{' '}
          <Text as="span" fontWeight="700">
            {getDateAndHour(order?.timestamps?.confirmed)}
          </Text>
        </Text>
        <Text fontWeight="500" lineHeight="16px">
          {t('Endereço:')}{' '}
          <Text as="span" fontWeight="700">
            {order?.destination?.address.main ?? 'N/E'}
          </Text>
        </Text>
        <Text fontWeight="500" lineHeight="16px">
          {t('Complemento:')}{' '}
          <Text as="span" fontWeight="700">
            {isAdditional ? order?.destination?.additionalInfo : 'N/I'}
          </Text>
        </Text>
        <SectionTitle mt="2" fontSize="18px">
          {t('Detalhes do pedido')}
        </SectionTitle>
        <Box mt="2">
          <Flex flexDir="row" fontWeight="700" borderBottom="1px solid black">
            <Box w="10%">Qtd.</Box>
            <Box w="60%">Item</Box>
            <Box w="30%" textAlign="end">Preço (un.)</Box>
          </Flex>
          {renderItems(order?.items)}
          <Flex flexDir="row" borderTop="1px solid black" fontWeight="700">
            <Box w="50%">Total</Box>
            <Box w="50%" textAlign="end">
              {order?.fare?.business?.value ? formatCurrency(order.fare.business.value) : 0}
            </Box>
          </Flex>
        </Box>
        {/* <Table mt="2" size="sm" variant="unstyled" color="black">
          <Thead borderBottom="1px solid black">
            <Tr>
              <Th isNumeric fontSize="12px" px="0" maxW="20px">
                {t('Qtd.')}
              </Th>
              <Th fontSize="12px" pl="0">
                {t('Item')}
              </Th>
              <Th isNumeric fontSize="12px" pr="0">
                {t('Valor und.')}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {order?.items?.map((item: OrderItem) => (
              <React.Fragment key={Math.random()}>
                <Tr
                  fontWeight="700"
                  borderBottom={
                    item.complements && item.complements?.length > 0 ? 'none' : '1px solid black'
                  }
                >
                  <Td isNumeric fontSize="11px" px="0">
                    {item.quantity}
                  </Td>
                  <Td fontSize="11px" pl="0">
                    {item.product.categoryName ?? 'N/E'} <br />
                    <Text as="span" fontSize="10px" fontWeight="700">
                      {item.product.name}
                    </Text>
                    <br />
                    <Text as="span" fontSize="10px" fontWeight="500">
                      {item.notes}
                    </Text>
                  </Td>
                  <Td isNumeric fontSize="11px" pr="0">
                    {formatCurrency(item.product.price)}
                  </Td>
                </Tr>
                {item.complements &&
                  item.complements.map((complement, index) => (
                    <Tr
                      key={Math.random()}
                      pl="0"
                      borderBottom={
                        item.complements?.length === index + 1 ? '1px solid black' : 'none'
                      }
                    >
                      <Td isNumeric fontSize="11px" fontWeight="500" px="0">
                        {item.quantity > 1 ? (
                          <Multiplier products={item.quantity} complements={complement.quantity} />
                        ) : (
                          complement.quantity ?? 1
                        )}
                      </Td>
                      <Td fontSize="11px" fontWeight="500">
                        {complement.groupName ?? 'N/E'}
                        {' - '}
                        <Text as="span">{complement.name}</Text>
                      </Td>
                      <Td isNumeric fontSize="11px" fontWeight="500" pr="0">
                        {formatCurrency(complement.price)}
                      </Td>
                    </Tr>
                  ))}
              </React.Fragment>
            ))}
          </Tbody>
          <Tfoot bgColor="gray.50">
            <Tr>
              <Th fontSize="12px" pl="0">
                {t('Total')}
              </Th>
              <Th></Th>
              <Th isNumeric fontSize="12px" pr="0">
                {order?.fare?.business?.value ? formatCurrency(order.fare.business.value) : 0}
              </Th>
            </Tr>
          </Tfoot>
        </Table> */}
        <SectionTitle mt="2" fontSize="18px">
          {t('Observações')}
        </SectionTitle>
        {order?.consumer.cpf && (
          <Text mt="1" fontSize="12px">
            {t('INCLUIR CPF NA NOTA')}
          </Text>
        )}
        {order?.additionalInfo && (
          <Text mt="1" fontSize="12px">
            {order?.additionalInfo.toUpperCase()}
          </Text>
        )}
        {!order?.consumer.cpf && !order?.additionalInfo && (
          <Text mt="1" fontSize="12px">
            {t('Sem observações.')}
          </Text>
        )}
        <Box mt="4" bg="black" textAlign="center">
          <Text fontSize="12px" fontWeight="700" color="white">
            {t('Este pedido já está pago')}
          </Text>
        </Box>
      </Box>
    );
  }
);
