import { Coupon, WithId } from '@appjusto/types';
import { Box, Button, Flex, Switch, Text } from '@chakra-ui/react';
import { useCoupon } from 'app/api/coupon/useCoupon';
import { Link, useRouteMatch } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { getCouponTypeLabel } from './utils';

export const CouponCard = ({ coupon }: { coupon: WithId<Coupon> }) => {
  const { path } = useRouteMatch();
  const { updateCoupon } = useCoupon();

  const {
    id,
    code,
    type,
    discount,
    usagePolicy,
    enabled,
    createdAt,
    updatedAt,
  } = coupon;

  const handleEnabled = (value: boolean) => {
    updateCoupon({
      couponId: coupon.id,
      changes: { usagePolicy, enabled: value },
    });
  };

  return (
    <Flex
      p="5"
      w="full"
      maxW="310px"
      flexDir="column"
      gap="4"
      border="1px solid #C8D7CB"
      borderRadius="md"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="lg" color="black">
          {code}
        </Text>
        <Flex gap="2" alignItems="center">
          <Text fontSize="xs" color="black">
            {enabled ? t('Ativado') : t('Desativado')}
          </Text>
          <Switch
            isChecked={enabled}
            onChange={(ev) => {
              ev.stopPropagation();
              handleEnabled(ev.target.checked);
            }}
          />
        </Flex>
      </Flex>
      <Flex
        justifyContent="space-between"
        py="3"
        borderTop="1px solid #C8D7CB"
        borderBottom="1px solid #C8D7CB"
      >
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="black">
            {t('Tipo')}
          </Text>
          <Text fontSize="xs">{getCouponTypeLabel(type)}</Text>
        </Box>
        {discount ? (
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="black">
              {t('Desconto')}
            </Text>
            <Text fontSize="xs" textAlign="end">
              {formatCurrency(discount)}
            </Text>
          </Box>
        ) : null}
      </Flex>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="black">
            {t('Criado em')}
          </Text>
          <Text fontSize="xs">{getDateAndHour(createdAt)}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="black">
            {t('Atualizado em')}
          </Text>
          <Text fontSize="xs">{getDateAndHour(updatedAt)}</Text>
        </Box>
      </Flex>
      <Link to={`${path}/${id}`}>
        <Button w="full" size="sm" variant="outline">
          {t('Ver detalhes')}
        </Button>
      </Link>
    </Flex>
  );
};
