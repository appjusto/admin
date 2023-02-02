import {
  CourierOrderRequest,
  DispatchingStatus,
  WithId,
} from '@appjusto/types';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { Textarea } from 'common/components/form/input/Textarea';
import { isEqual } from 'lodash';
import React from 'react';
import { t } from 'utils/i18n';
interface CourierNotifiedBoxProps {
  isOrderActive: boolean;
  request: WithId<CourierOrderRequest>;
  issue?: string;
  dispatchingStatus?: DispatchingStatus;
  canUpdateOrder?: boolean;
  allocateCourier(courierId: string, comment: string): void;
  isLoading?: boolean;
}

const CourierNotifiedBox = ({
  isOrderActive,
  request,
  issue,
  dispatchingStatus,
  canUpdateOrder,
  allocateCourier,
  isLoading = false,
}: CourierNotifiedBoxProps) => {
  // state
  const [isAllocating, setIsAllocating] = React.useState(false);
  const [comment, setComment] = React.useState('');
  // helpers
  const nameToDisplay = request.courierName
    ? request.courierName
    : request.orderId.substring(0, 7) + '...';
  // side effects
  React.useEffect(() => {
    if (dispatchingStatus === 'confirmed') setIsAllocating(false);
  }, [dispatchingStatus]);
  // UI
  return (
    <Box p="3" border="1px solid #ECF0E3" borderRadius="lg" bg="white">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          {/* <Text>{!isAllocating ? shortId : nameToDisplay}</Text> */}
          <Text>{nameToDisplay}</Text>
          {issue && <Text>{issue}</Text>}
        </Box>
        <HStack>
          <CustomButton
            mt="0"
            size="sm"
            w="120px"
            h="36px"
            label={t('Ver cadastro')}
            link={`/backoffice/couriers/${request.courierId}`}
            variant="outline"
          />
          {!isAllocating && canUpdateOrder && (
            <CustomButton
              mt="0"
              size="sm"
              w="120px"
              h="36px"
              label={t('Alocar')}
              isDisabled={
                !isOrderActive ||
                dispatchingStatus === 'confirmed' ||
                dispatchingStatus === 'outsourced'
              }
              isLoading={isLoading}
              onClick={() => setIsAllocating(true)}
            />
          )}
        </HStack>
      </Flex>
      {isAllocating && (
        <Box mt="4">
          <Text fontSize="lg">{t('Informe o motivo da alocação:')}</Text>
          <Textarea
            mt="2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Flex mt="4" justifyContent="flex-end">
            <CustomButton
              mt="0"
              size="sm"
              h="36px"
              label={t('Cancelar')}
              variant="dangerLight"
              onClick={() => setIsAllocating(false)}
            />
            <CustomButton
              mt="0"
              ml="4"
              size="sm"
              h="36px"
              label={t('Confirmar alocação')}
              isDisabled={
                !isOrderActive || dispatchingStatus === 'confirmed' || !comment
              }
              isLoading={isLoading}
              onClick={() => allocateCourier(request.courierId, comment)}
            />
          </Flex>
        </Box>
      )}
    </Box>
  );
};

const areEqual = (
  prevProps: CourierNotifiedBoxProps,
  nextProps: CourierNotifiedBoxProps
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(CourierNotifiedBox, areEqual);
