import { Box, Flex, HStack, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useOrderCourierRemoval } from 'app/api/order/useOrderCourierRemoval';
import { useOrderDeliveryInfos } from 'app/api/order/useOrderDeliveryInfos';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { Issue, IssueType, Order, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { Textarea } from 'common/components/form/input/Textarea';
import firebase from 'firebase/app';
import { DeliveryInfos } from 'pages/orders/drawers/orderdrawer/DeliveryInfos';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface ParticipantProps {
  id?: string;
  outsourceDelivery?: boolean;
  name?: string;
  instruction?: string;
  address?: string;
  additionalInfo?: string;
  onboarding?: firebase.firestore.FieldValue;
  buttonLabel?: string;
  buttonLink?: string;
  isBtnDisabled?: boolean;
  dropIssues?: WithId<Issue>[] | null;
  removeCourier?(issue?: WithId<Issue>, comment?: string): void;
  isLoading?: boolean;
}

const Participant = ({
  id,
  outsourceDelivery,
  name,
  instruction,
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
    if (dropIssues) setIssueId(dropIssues[0].id);
  }, [dropIssues]);
  React.useEffect(() => {
    if (!id) setIsRemoving(false);
  }, [id]);
  // UI
  return (
    <Box mb="10">
      {outsourceDelivery ? (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Logística assumida pelo restaurante:')}
        </Text>
      ) : (
        <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {name ? t('Nome:') : t('Instrução:')}{' '}
          <Text as="span" fontWeight="500">
            {name ?? instruction}
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
        <HStack mt="4" w="100%" spacing={4}>
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
                      <Radio mt="1" key={issue.id} value={issue.id} size="md" bg="white">
                        {issue.title}
                      </Radio>
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
              <Flex mt="4" w="100%" justifyContent="space-between">
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
        </HStack>
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
  const { isOrderActive } = useOrderDeliveryInfos(order);
  const issues = useIssuesByType(order?.type === 'food' ? dropsFoodIssues : dropsP2pIssues);
  const { courierManualRemoval, removalResult } = useOrderCourierRemoval();
  // state
  const [error, setError] = React.useState(initialError);
  //refs
  const submission = React.useRef(0);
  // handlers
  const removeCourierFromOrder = (issue?: WithId<Issue>, comment?: string) => {
    submission.current += 1;
    if (!order?.id || !order?.courier?.id)
      return setError({
        status: true,
        error: null,
      });
    if (!issue)
      return setError({
        status: true,
        error: null,
        message: {
          title: 'Informações incompletas',
          description: 'É preciso irformar o motivo da remoção.',
        },
      });
    courierManualRemoval({ orderId: order.id, issue, comment });
  };
  // side effects
  React.useEffect(() => {
    if (removalResult.isError) {
      setError({
        status: true,
        error: removalResult.error,
        message: { title: 'Operação negada!', description: `${removalResult.error}` },
      });
    }
  }, [removalResult.isError, removalResult.error]);
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
          />
          <SectionTitle>{t('Restaurante')}</SectionTitle>
          <Participant
            name={order?.business?.name ?? 'N/E'}
            address={order?.origin?.address?.main ?? 'N/E'}
            additionalInfo={order?.origin?.additionalInfo}
            buttonLabel={t('Ver cadastro do restaurante')}
            buttonLink={`/backoffice/businesses/${order?.business?.id}`}
          />
        </Box>
      ) : (
        <Box>
          <SectionTitle>{t('Cliente')}</SectionTitle>
          <Participant name={order?.consumer?.name ?? 'N/E'} />
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
        outsourceDelivery={order?.dispatchingStatus === 'outsourced'}
        name={order?.courier?.name ?? 'N/E'}
        buttonLabel={t('Ver cadastro do entregador')}
        buttonLink={`/backoffice/couriers/${order?.courier?.id}`}
        isBtnDisabled={!order?.courier}
        dropIssues={issues}
        removeCourier={removeCourierFromOrder}
        isLoading={removalResult.isLoading}
      />
      {isOrderActive ? (
        <DeliveryInfos order={order!} />
      ) : (
        <>
          <SectionTitle>{t('Destino do pedido')}</SectionTitle>
          <Text mt="1" fontSize="15px" lineHeight="21px">
            {order?.destination?.address.description ?? 'N/E'}
          </Text>
        </>
      )}
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={removalResult.isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </Box>
  );
};
