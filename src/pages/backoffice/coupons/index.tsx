import { ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useObserveCoupons } from 'app/api/coupon/useObserveCoupons';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CouponDrawer } from 'pages/promotions/CouponDrawer';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { CouponsTable } from './CouponsTable';

const CouponsPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { userAbility } = useContextFirebaseUser();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [code, setCode] = React.useState('');
  const { coupons, fetchNextPage } = useObserveCoupons(code);
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };

  const clearFilters = () => {
    setCode('');
  };
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  // UI
  return (
    <Box>
      <PageHeader
        title={t('Cupons promocionais')}
        subtitle={t(`Atualizado ${dateTime}`)}
      />
      <Flex mt="8">
        <CustomInput
          mt="0"
          id="code"
          maxW="260px"
          label={t('Código do cupom')}
          placeholder={t('Digite o código do cupom')}
          value={code}
          onChange={(ev) => setCode(ev.target.value)}
          isRequired
        />
      </Flex>
      <Flex
        mt="8"
        w="100%"
        pb="2"
        justifyContent="space-between"
        borderBottom="1px solid #C8D7CB"
      >
        <HStack spacing={4} overflowX="auto">
          {/* <FilterText
            isActive={!isBlocked}
            label={t('Todos')}
            onClick={() => setIsBlocked(false)}
          />
          <FilterText
            isActive={isBlocked}
            label={t('Bloqueados')}
            onClick={() => setIsBlocked(true)}
          /> */}
        </HStack>
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <Flex mt="6" flexDir="row" justifyContent="space-between" color="black">
        <HStack spacing={8}>
          <Text fontSize="lg" fontWeight="700" lineHeight="26px">
            {t(`${coupons?.length ?? '0'} cupons criados`)}
          </Text>
          {/*<CheckboxGroup
            colorScheme="green"
            value={loggedAt}
            onChange={(values: UserType[]) => setLoggedAt(values)}
          >
            <HStack
              alignItems="flex-start"
              color="black"
              spacing={8}
              fontSize="16px"
              lineHeight="22px"
            >
              <Checkbox value="manager">{t('Manager')}</Checkbox>
              <Checkbox value="courier">{t('Entregador')}</Checkbox>
              <Checkbox value="consumer">{t('Consumidor')}</Checkbox>
            </HStack>
          </CheckboxGroup>*/}
        </HStack>
        {userAbility?.can('create', 'areas') && (
          <CustomButton mt="0" label={t('Criar cupom')} link={`${path}/new`} />
        )}
      </Flex>
      <CouponsTable coupons={coupons} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route exact path={`${path}/:couponId`}>
          <CouponDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default CouponsPage;
