import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useObserveBusinessCoupons } from 'app/api/coupon/useObserveBusinessCoupons';
import { useContextBusiness } from 'app/state/business/context';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { t } from 'utils/i18n';
import { CouponCard } from './CouponCard';
import { CouponDrawer } from './CouponDrawer';

const PromotionsPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { business } = useContextBusiness();
  // state
  const coupons = useObserveBusinessCoupons(business?.id);
  // handlers
  const closeDrawerHandler = () => history.replace(path);
  // UI
  return (
    <Box>
      <PageHeader
        title={t('Promoções')}
        subtitle={t(
          'Aumente suas vendas com cupons promocionais customizados e autonomia de verdade'
        )}
      />
      <SectionTitle>{t('Principais tipos de cupons')}</SectionTitle>
      <Stack mt="6" direction={{ base: 'column', md: 'row' }}>
        <Link to={`${path}/new?type=delivery-free`}>
          <Box p="4" border="1px solid #C8D7CB" borderRadius="lg">
            <Text fontSize="lg">{t('Entrega grátis')}</Text>
            <Text fontSize="sm">
              {t(
                'Você define um valor mínimo e os pedidos terão entrega grátis'
              )}
            </Text>
          </Box>
        </Link>
        <Link to={`${path}/new?type=delivery-discount`}>
          <Box p="4" border="1px solid #C8D7CB" borderRadius="lg">
            <Text fontSize="lg">{t('Desconto na entrega')}</Text>
            <Text fontSize="sm">
              {t(
                'Você define um valor mínimo e o valor que deseja subsidiar da entrega'
              )}
            </Text>
          </Box>
        </Link>
        <Link to={`${path}/new?type=food-discount`}>
          <Box p="4" border="1px solid #C8D7CB" borderRadius="lg">
            <Text fontSize="lg">{t('Desconto nos produtos')}</Text>
            <Text fontSize="sm">
              {t(
                'Você define um valor mínimo e o desconto que deseja aplicar nos produtos'
              )}
            </Text>
          </Box>
        </Link>
      </Stack>
      <SectionTitle>{t('Seus cupons')}</SectionTitle>
      <Text>
        {t(
          'Aqui você pode editar, ativar ou desativar os seus cupons, quando quiser'
        )}
      </Text>
      <Flex mt="6" flexWrap="wrap" gap="4">
        {coupons?.length ? (
          coupons.map((coupon) => {
            return <CouponCard key={coupon.id} coupon={coupon} />;
          })
        ) : (
          <p>nenhum cupom adicionado</p>
        )}
      </Flex>
      <Switch>
        <Route path={`${path}/:couponId`}>
          <CouponDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default PromotionsPage;
