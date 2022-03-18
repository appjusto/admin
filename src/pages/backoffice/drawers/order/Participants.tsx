import { CourierMode, Issue, IssueType, Order, WithId } from '@appjusto/types';
import { Box, Flex, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { useOrderCourierRemoval } from 'app/api/order/useOrderCourierRemoval';
import { useOrderDeliveryInfos } from 'app/api/order/useOrderDeliveryInfos';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextServerTime } from 'app/state/server-time';
import { CustomButton } from 'common/components/buttons/CustomButton';
import CustomRadio from 'common/components/form/CustomRadio';
import { Textarea } from 'common/components/form/input/Textarea';
import { FieldValue } from 'firebase/firestore';
import { modePTOptions } from 'pages/backoffice/utils';
import { DeliveryInfos } from 'pages/orders/drawers/orderdrawer/DeliveryInfos';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface ParticipantProps {
  id?: string;
  outsourceLabel?: string | null;
  name?: string;
  mode?: CourierMode;
  instruction?: string;
  deliveries?: number;
  rejected?: number;
  address?: string;
  additionalInfo?: string;
  onboarding?: FieldValue;
  buttonLabel?: string;
  buttonLink?: string;
  isBtnDisabled?: boolean;
  dropIssues?: Issue[] | null;
  removeCourier?(issue?: Issue, comment?: string): void;
  isLoading?: boolean;
}

const Participant = ({
  id,
  outsourceLabel,
  name,
  mode,
  instruction,
  deliveries,
  rejected,
  address,
  additionalInfo,
  onboarding,
  buttonLabel,
  buttonLink,
  isBtnDisabled = false,
  dropIssues,
  removeCourier,
  isLoading,
}: ParticipantProps) => {
  // state
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [issueId, setIssueId] = React.useState((dropIssues && dropIssues[0].id) ?? '');
  const [comment, setComment] = React.useState('');
  // handlers
  const handleRemoving = () => {
    const issue = dropIssues?.find((issue) => issue.id === issueId);
    removeCourier!(issue, comment);
  };
  // side effects
  React.useEffect(() => {
    if (dropIssues && dropIssues[0].id) setIssueId(dropIssues[0].id);
  }, [dropIssues]);
  React.useEffect(() => {
    if (!id) setIsRemoving(false);
  }, [id]);
  // UI
  return (
    <Box mb="10">
      {outsourceLabel ? (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {outsourceLabel}
        </Text>
      ) : (
        <>
          <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
            {name ? t('Nome:') : t('Instrução:')}{' '}
            <Text as="span" fontWeight="500">
              {name ?? instruction}
            </Text>
          </Text>
          {mode && (
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Modalidade da entrega:')}{' '}
              <Text as="span" fontWeight="500">
                {modePTOptions[mode] ?? 'N/E'}
              </Text>
            </Text>
          )}
        </>
      )}
      {typeof deliveries === 'number' && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Pedidos entregues:')}{' '}
          <Text as="span" fontWeight="500">
            {deliveries}
          </Text>
        </Text>
      )}
      {typeof rejected === 'number' && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Pedidos rejeitados:')}{' '}
          <Text as="span" fontWeight="500">
            {rejected}
          </Text>
        </Text>
      )}
      {address && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Endereço principal:')}{' '}
          <Text as="span" fontWeight="500">
            {address}
          </Text>
        </Text>
      )}
      {additionalInfo && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Complemento:')}{' '}
          <Text as="span" fontWeight="500">
            {additionalInfo}
          </Text>
        </Text>
      )}
      {onboarding && (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Data do onboarding:')}{' '}
          <Text as="span" fontWeight="500">
            {getDateAndHour(onboarding)}
          </Text>
        </Text>
      )}
      {buttonLabel && (
        <Stack mt="4" w="100%" spacing={4} direction={{ base: 'column', md: 'row' }}>
          {isRemoving ? (
            <Flex
              w="100%"
              flexDir="column"
              justifyContent="center"
              bg="#FFF8F8"
              p="4"
              borderRadius="lg"
            >
              <Text fontSize="lg">{'Informe o motivo da remoção:'}</Text>
              <RadioGroup
                onChange={(value) => setIssueId(value as string)}
                value={issueId}
                colorScheme="green"
              >
                <Flex flexDir="column" justifyContent="flex-start">
                  {dropIssues &&
                    dropIssues.map((issue) => (
                      <CustomRadio mt={{ base: '3', md: '1' }} key={issue.id} value={issue.id}>
                        {issue.title}
                      </CustomRadio>
                    ))}
                </Flex>
              </RadioGroup>
              <Text mt="4" fontSize="lg">
                {'Comentário:'}
              </Text>
              <Textarea
                mt="2"
                bg="white"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Flex mt="4" w="100%" justifyContent="flex-end">
                <CustomButton
                  mt="0"
                  h="34px"
                  w="100%"
                  label={t('Manter')}
                  fontSize="xs"
                  lineHeight="lg"
                  onClick={() => setIsRemoving(false)}
                />
                <CustomButton
                  mt="0"
                  ml="4"
                  h="34px"
                  w="100%"
                  variant="danger"
                  label={t('Remover')}
                  fontSize="xs"
                  lineHeight="lg"
                  onClick={handleRemoving}
                  isLoading={isLoading}
                />
              </Flex>
            </Flex>
          ) : (
            <>
              <CustomButton
                minW="220px"
                h="34px"
                mt="0"
                borderColor="#697667"
                variant="outline"
                label={buttonLabel}
                link={buttonLink}
                fontSize="xs"
                lineHeight="lg"
                isDisabled={isBtnDisabled}
              />
              {removeCourier && (
                <CustomButton
                  h="34px"
                  mt="0"
                  variant="dangerLight"
                  label={t('Remover entregador')}
                  fontSize="xs"
                  lineHeight="lg"
                  isDisabled={isBtnDisabled}
                  onClick={() => setIsRemoving(true)}
                />
              )}
            </>
          )}
        </Stack>
      )}
    </Box>
  );
};

interface ParticipantsProps {
  order?: WithId<Order> | null;
}

const dropsFoodIssues = ['courier-drops-food-delivery'] as IssueType[];
const dropsP2pIssues = ['courier-drops-p2p-delivery'] as IssueType[];

export const Participants = ({ order }: ParticipantsProps) => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { getServerTime } = useContextServerTime();
  const { isOrderActive } = useOrderDeliveryInfos(getServerTime, order);
  const issues = useIssuesByType(order?.type === 'food' ? dropsFoodIssues : dropsP2pIssues);
  const { courierManualRemoval, removalResult } = useOrderCourierRemoval();
  // handlers
  const removeCourierFromOrder = (issue?: WithId<Issue>, comment?: string) => {
    if (!order?.id || !order?.courier?.id)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'Participants-valid',
      });
    if (!issue)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'Participants-valid-no-issue',
        message: {
          title: 'Informações incompletas',
          description: 'É preciso irformar o motivo da remoção.',
        },
      });
    courierManualRemoval({ orderId: order.id, issue, comment });
  };
  // UI
  return (
    <Box>
      {order?.type === 'food' ? (
        <Box>
          <SectionTitle>{t('Cliente')}</SectionTitle>
          <Participant
            name={order?.consumer?.name ?? 'N/E'}
            address={order?.destination?.address?.main ?? 'N/E'}
            additionalInfo={order?.destination?.additionalInfo}
            buttonLabel={t('Ver cadastro do cliente')}
            buttonLink={`/backoffice/consumer/${order?.consumer.id}`}
          />
          <SectionTitle>{t('Restaurante')}</SectionTitle>
          <Participant
            name={order?.business?.name ?? 'N/E'}
            address={order?.origin?.address?.main ?? 'N/E'}
            additionalInfo={order?.origin?.additionalInfo}
            buttonLabel={t('Ver cadastro do restaurante')}
            buttonLink={`/backoffice/business/${order?.business?.id}`}
          />
        </Box>
      ) : (
        <Box>
          <SectionTitle>{t('Cliente')}</SectionTitle>
          <Participant
            name={order?.consumer?.name ?? 'N/E'}
            buttonLabel={t('Ver cadastro do cliente')}
            buttonLink={`/backoffice/consumer/${order?.consumer.id}`}
          />
          <SectionTitle>{t('Origem')}</SectionTitle>
          <Participant
            instruction={order?.origin?.intructions ?? 'N/E'}
            address={order?.origin?.address?.main ?? 'N/E'}
            additionalInfo={order?.origin?.additionalInfo}
          />
          <SectionTitle>{t('Destino')}</SectionTitle>
          <Participant
            instruction={order?.destination?.intructions ?? 'N/E'}
            address={order?.destination?.address?.main ?? 'N/E'}
            additionalInfo={order?.destination?.additionalInfo}
          />
        </Box>
      )}
      <SectionTitle>{t('Entregador')}</SectionTitle>
      <Participant
        id={order?.courier?.id}
        outsourceLabel={
          order?.dispatchingStatus === 'outsourced' ? t('Logística fora da rede') : undefined
        }
        name={order?.courier?.name ?? 'N/E'}
        mode={order?.courier?.mode}
        deliveries={order?.courier?.statistics?.deliveries}
        rejected={order?.courier?.statistics?.rejected}
        buttonLabel={t('Ver cadastro do entregador')}
        buttonLink={`/backoffice/courier/${order?.courier?.id}`}
        isBtnDisabled={!order?.courier}
        dropIssues={issues}
        removeCourier={removeCourierFromOrder}
        isLoading={removalResult.isLoading}
      />
      <SectionTitle>{t('Frota')}</SectionTitle>
      <Text mt="2" mb="10" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Nome:')}{' '}
        <Text as="span" fontWeight="500">
          {order?.fare?.fleet.name ?? 'N/E'}
        </Text>
      </Text>
      {isOrderActive ? (
        <DeliveryInfos order={order!} isBackofficeDrawer />
      ) : (
        <>
          <SectionTitle>{t('Destino do pedido')}</SectionTitle>
          <Text mt="1" fontSize="15px" lineHeight="21px">
            {order?.destination?.address.description ?? 'N/E'}
          </Text>
        </>
      )}
    </Box>
  );
};
