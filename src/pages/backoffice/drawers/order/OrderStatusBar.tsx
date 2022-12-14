import {
  DispatchingState,
  Fulfillment,
  Issue,
  IssueType,
  OrderRefundType,
  OrderStatus,
  OrderType,
} from '@appjusto/types';
import {
  Box,
  Checkbox,
  Flex,
  HStack,
  Icon,
  Link,
  Radio,
  RadioGroup,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useObserveOrderPrivateConfirmation } from 'app/api/order/useObserveOrderPrivateConfirmation';
import { useOrderNotes } from 'app/api/order/useOrderNotes';
import { ProfileNotes } from 'common/components/backoffice/ProfileNotes';
import { MdInfo, MdOpenInNew } from 'react-icons/md';
import { formatCurrency } from 'utils/formatters';
import { getOrderCancellator } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface OrderStatusProps {
  orderId: string;
  orderType?: OrderType;
  orderStatus?: OrderStatus;
  fulfillment?: Fulfillment;
  status?: OrderStatus;
  dispatchingState?: DispatchingState | null;
  issue?: Issue | null;
  message?: string;
  cancelOptions?: Issue[] | null;
  refund: OrderRefundType[];
  refundValue: number;
  onRefundingChange(type: OrderRefundType, value: boolean): void;
  updateState(
    type: string,
    value: OrderStatus | DispatchingState | IssueType | string
  ): void;
  courierId?: string;
  businessInsurance?: boolean;
  businessIndemnity: boolean;
  onBusinessIndemnityChange(value: boolean): void;
}

export const OrderStatusBar = ({
  orderId,
  orderType,
  orderStatus,
  fulfillment,
  status,
  dispatchingState,
  issue,
  message,
  cancelOptions,
  refund,
  refundValue,
  onRefundingChange,
  updateState,
  courierId,
  businessInsurance,
  businessIndemnity,
  onBusinessIndemnityChange,
}: OrderStatusProps) => {
  // context
  const { confirmation, frontUrl, packageUrl } =
    useObserveOrderPrivateConfirmation(orderId, courierId);
  const {
    orderNotes,
    updateOrderNote,
    deleteOrderNote,
    updateResult,
    deleteResult,
  } = useOrderNotes(orderId);
  // helpers
  const isOrderActive = orderStatus
    ? ['preparing', 'ready', 'dispatching'].includes(orderStatus)
    : false;
  const cancelator = getOrderCancellator(issue?.type);
  // UI
  return (
    <Box px="4">
      <Flex flexDir="row" justifyContent="space-between">
        <Box>
          <SectionTitle mt="0">{t('Alterar status do pedido:')}</SectionTitle>
          <RadioGroup
            mt="2"
            onChange={(value: OrderStatus) => updateState('status', value)}
            value={status}
            defaultValue="1"
            colorScheme="green"
            color="black"
            fontSize="15px"
            lineHeight="21px"
          >
            <Flex flexDir="column" justifyContent="flex-start">
              <Radio mt="2" value="confirming">
                {t('Confirmando')}
              </Radio>
              <Radio mt="2" value="scheduled">
                {t('Agendado')}
              </Radio>
              <Radio
                mt="2"
                value="confirmed"
                isDisabled={orderStatus !== 'scheduled'}
              >
                {t('Confirmado')}
              </Radio>
              {orderType === 'food' && (
                <>
                  <Radio mt="2" value="preparing">
                    {t('Em preparo')}
                  </Radio>
                  <Radio mt="2" value="ready">
                    {t('Pronto - aguardando entregador')}
                  </Radio>
                </>
              )}
              <Radio mt="2" value="dispatching">
                {t('A caminho da entrega')}
              </Radio>
              <Radio mt="2" value="delivered">
                {t('Entregue')}
              </Radio>
              <Radio mt="2" value="rejected" isDisabled>
                {t('Rejeitado')}
              </Radio>
              <Radio mt="2" value="canceled">
                {t('Cancelado')}
              </Radio>
            </Flex>
          </RadioGroup>
        </Box>
        {isOrderActive && fulfillment === 'delivery' && (
          <Box>
            <SectionTitle mt="0">
              {t('Alterar status da entrega:')}
            </SectionTitle>
            <RadioGroup
              mt="2"
              onChange={(value: DispatchingState) =>
                updateState('dispatchingState', value)
              }
              value={dispatchingState ?? undefined}
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <Flex flexDir="column" justifyContent="flex-start">
                <Radio mt="2" value="going-pickup">
                  {t('Entreg. a caminho da retirada')}
                </Radio>
                <Radio mt="2" value="arrived-pickup">
                  {t('Entreg. no local da retirada')}
                </Radio>
                <Radio mt="2" value="going-destination">
                  {t('Entreg. a caminho da entrega')}
                </Radio>
                <Radio mt="2" value="arrived-destination">
                  {t('Entreg. no local da entrega')}
                </Radio>
              </Flex>
            </RadioGroup>
          </Box>
        )}
      </Flex>
      {orderStatus === 'delivered' && (
        <>
          <SectionTitle>{t('Dados da confirmação:')}</SectionTitle>
          <Text
            mt="2"
            fontSize="15px"
            color="black"
            fontWeight="700"
            lineHeight="22px"
          >
            {t('Código informado:')}{' '}
            <Text as="span" fontWeight="500">
              {confirmation?.handshakeResponse ? t('Sim') : t('Não')}
            </Text>
          </Text>
          {confirmation?.deliveredTo && (
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Entregue para:')}{' '}
              <Text as="span" fontWeight="500">
                {confirmation.deliveredTo}
              </Text>
            </Text>
          )}
          {confirmation?.comment && (
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Comentário:')}{' '}
              <Text as="span" fontWeight="500">
                {confirmation.comment}
              </Text>
            </Text>
          )}
          <Flex flexDir="column">
            {frontUrl && (
              <Link
                mt="2"
                color="black"
                href={frontUrl}
                _focus={{ outline: 'none' }}
                textDecor="underline"
                isExternal
              >
                {t('Foto da fachada')}
                <Icon ml="2" mb="-1" as={MdOpenInNew} />
              </Link>
            )}
            {packageUrl && (
              <Link
                mt="2"
                color="black"
                href={packageUrl}
                _focus={{ outline: 'none' }}
                textDecor="underline"
                isExternal
              >
                {t('Foto do pacote')}
                <Icon ml="2" mb="-1" as={MdOpenInNew} />
              </Link>
            )}
          </Flex>
        </>
      )}
      {(status === 'canceled' || status === 'rejected') && (
        <>
          <SectionTitle>{t('Dados do cancelamento:')}</SectionTitle>
          {orderStatus === 'canceled' || orderStatus === 'rejected' ? (
            <>
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Cancelado por:')}{' '}
                <Text as="span" fontWeight="500">
                  {cancelator}
                </Text>
              </Text>
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Motivo informado:')}{' '}
                <Text as="span" fontWeight="500">
                  {issue?.title ?? 'N/I'}
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Text
                mt="2"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Informe quem está solicitando este cancelamento:')}
              </Text>
              <RadioGroup
                mt="2"
                onChange={(value: string) => updateState('issue', value)}
                value={issue?.id}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <Flex flexDir="column" justifyContent="flex-start">
                  {cancelOptions?.map((option) => (
                    <Radio key={option.id} mt="2" value={option.id}>
                      {option.title}
                    </Radio>
                  ))}
                </Flex>
              </RadioGroup>
            </>
          )}
          <SectionTitle>{t('Reembolso:')}</SectionTitle>
          {businessInsurance && (
            <Box
              mt="4"
              p="4"
              flexDir="row"
              border="1px solid #C8D7CB"
              borderRadius="lg"
              // bgColor="yellow"
              // maxW="600px"
            >
              <HStack>
                <Icon as={MdInfo} w="24px" h="24px" />
                <Text>
                  {t('O restaurante possui cobertura para este pedido')}
                </Text>
              </HStack>
              <Checkbox
                mt="4"
                isChecked={businessIndemnity}
                onChange={(event) =>
                  onBusinessIndemnityChange(event.target.checked)
                }
              >
                {t('Realizar ressarcimento do valor dos produtos')}
              </Checkbox>
            </Box>
          )}
          <Text
            mt="2"
            fontSize="15px"
            color="black"
            fontWeight="700"
            lineHeight="22px"
          >
            {t(`Valor do reembolso: ${formatCurrency(refundValue)}`)}
          </Text>
          <HStack mt="4" spacing={4}>
            {orderType === 'food' ? (
              <Checkbox
                width="120px"
                colorScheme="green"
                size="lg"
                spacing="1rem"
                iconSize="1rem"
                isChecked={refund.includes('products')}
                onChange={(e) =>
                  onRefundingChange('products', e.target.checked)
                }
              >
                {t('Produtos')}
              </Checkbox>
            ) : (
              <Checkbox
                width="120px"
                colorScheme="green"
                size="lg"
                spacing="1rem"
                iconSize="1rem"
                isChecked={refund.includes('service')}
                onChange={(e) => onRefundingChange('service', e.target.checked)}
              >
                {t('Taxa AppJusto')}
              </Checkbox>
            )}
            <Checkbox
              width="120px"
              colorScheme="green"
              size="lg"
              spacing="1rem"
              iconSize="1rem"
              isChecked={refund.includes('delivery')}
              onChange={(e) => onRefundingChange('delivery', e.target.checked)}
            >
              {t('Entrega')}
            </Checkbox>
            <Checkbox
              width="120px"
              colorScheme="green"
              size="lg"
              spacing="1rem"
              iconSize="1rem"
              isChecked={refund.includes('tip')}
              onChange={(e) => onRefundingChange('tip', e.target.checked)}
            >
              {t('Gorjeta')}
            </Checkbox>
          </HStack>
          <SectionTitle>{t('Comentário:')}</SectionTitle>
          <Textarea
            mt="2"
            value={message}
            onChange={(ev) => updateState('message', ev.target.value)}
          />
        </>
      )}
      <SectionTitle>{t('Anotações')}</SectionTitle>
      <ProfileNotes
        profileNotes={orderNotes}
        updateNote={updateOrderNote}
        deleteNote={deleteOrderNote}
        updateResult={updateResult}
        deleteResult={deleteResult}
      />
    </Box>
  );
};
