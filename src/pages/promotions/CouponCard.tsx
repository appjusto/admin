import { Coupon, WithId } from '@appjusto/types';
import { Box, Flex, Link, Switch, Text } from '@chakra-ui/react';
import { useCoupon } from 'app/api/coupon/useCoupon';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
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
    minOrderValue,
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
      p="4"
      flexDir="column"
      gap="4"
      border="1px solid #C8D7CB"
      borderRadius="md"
    >
      <Flex justifyContent="space-between">
        <Text fontSize="lg">{code}</Text>
        <Link
          as={RouterLink}
          to={`${path}/${id}`}
          fontSize="sm"
          textDecor="underline"
        >
          {t('Ver detalhes')}
        </Link>
      </Flex>
      <Box>
        <Text>{t('Tipo: ') + getCouponTypeLabel(type)}</Text>
        {discount ? (
          <Text>{t('Desconto: ') + formatCurrency(discount)}</Text>
        ) : null}
        <Text>{t('Valor mím.: ') + formatCurrency(minOrderValue ?? 0)}</Text>
      </Box>
      <Box>
        <Text fontSize="xs">
          {t('Criado em: ') + getDateAndHour(createdAt)}
        </Text>
        <Text fontSize="xs">
          {t('Atualizado em: ') + getDateAndHour(updatedAt)}
        </Text>
      </Box>
      <Switch
        isChecked={enabled}
        onChange={(ev) => {
          ev.stopPropagation();
          handleEnabled(ev.target.checked);
        }}
      />
    </Flex>
  );
};
