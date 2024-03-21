import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { useObserveBusinessCoupons } from 'app/api/coupon/useObserveBusinessCoupons';
import { useContextBusiness } from 'app/state/business/context';
import { ReactComponent as couponIcon } from 'common/img/coupon.svg';
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
      <Flex mt="6" flexDir={{ base: 'column', md: 'row' }} gap="4">
        <Link to={`${path}/new?type=food-discount`} style={{ flex: 1 }}>
          <Flex
            p="4"
            minH="128px"
            border="1px solid #C8D7CB"
            borderRadius="lg"
            alignItems="center"
            gap="4"
            _hover={{ bgColor: 'gray.50' }}
          >
            <Icon as={couponIcon} w="8" h="8" minW="8" />
            <Box experimental_spaceY="2">
              <Text fontSize="lg">{t('Desconto nos produtos')}</Text>
              <Text fontSize="xs">
                {t('Crie um cupom de desconto nos seus produtos')}
              </Text>
            </Box>
          </Flex>
        </Link>
        <Link to={`${path}/new?type=delivery-discount`} style={{ flex: 1 }}>
          <Flex
            p="4"
            minH="128px"
            border="1px solid #C8D7CB"
            borderRadius="lg"
            alignItems="center"
            gap="4"
            _hover={{ bgColor: 'gray.50' }}
          >
            <Icon as={couponIcon} w="8" h="8" minW="8" />
            <Box experimental_spaceY="2">
              <Text fontSize="lg">{t('Desconto na entrega')}</Text>
              <Text fontSize="xs">
                {t('Crie um cupom de desconto no valor da entrega')}
              </Text>
            </Box>
          </Flex>
        </Link>
        <Link to={`${path}/new?type=delivery-free`} style={{ flex: 1 }}>
          <Flex
            p="4"
            minH="128px"
            border="1px solid #C8D7CB"
            borderRadius="lg"
            alignItems="center"
            gap="4"
            _hover={{ bgColor: 'gray.50' }}
          >
            <Icon as={couponIcon} w="8" h="8" minW="8" />
            <Box experimental_spaceY="2">
              <Text fontSize="lg">{t('Entrega grátis')}</Text>
              <Text fontSize="xs">
                {t(
                  'Crie um cupom de entrega grátis, para pedidos no seu raio de entregas'
                )}
              </Text>
            </Box>
          </Flex>
        </Link>
      </Flex>
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
          <Flex
            w="full"
            p="12"
            justifyContent="center"
            bgColor="gray.50"
            borderRadius="lg"
          >
            <Flex flexDir="column" alignItems="center">
              <Text fontSize="sm" maxW="360px" textAlign="center">
                Clique nos cartões acima, para começar a criar seus cupons de
                descontos
              </Text>
            </Flex>
          </Flex>
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
