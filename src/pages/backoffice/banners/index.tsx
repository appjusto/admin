import { Box, Flex } from '@chakra-ui/react';
import { useObserveBannersByFlavor } from 'app/api/banners/useObserveBannersByFlavor';
import { useObserveBannersOrdering } from 'app/api/banners/useObserveBannersOrdering';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BannerDrawer } from '../drawers/banner';
import { BannersGroups } from './BannersGroup';

const BannersPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const { ordering, updateBannersOrdering } = useObserveBannersOrdering();
  const consumersBanners = useObserveBannersByFlavor('consumer');
  const businessesBanners = useObserveBannersByFlavor('business');
  const couriersBanners = useObserveBannersByFlavor('courier');
  const [dateTime, setDateTime] = React.useState('');
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  // UI
  return (
    <Box>
      <PageHeader title={t('Banners')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="4" justifyContent="flex-end">
        <CustomButton label={t('Criar banner')} link={`${path}/new`} />
      </Flex>
      <Box>
        <BannersGroups
          title={t('Consumidores')}
          flavor="consumer"
          ordering={ordering}
          updateOrdering={updateBannersOrdering}
          banners={consumersBanners}
        />
        <BannersGroups
          title={t('Restaurantes')}
          flavor="business"
          ordering={ordering}
          updateOrdering={updateBannersOrdering}
          banners={businessesBanners}
        />
        <BannersGroups
          title={t('Entregadores')}
          flavor="courier"
          ordering={ordering}
          updateOrdering={updateBannersOrdering}
          banners={couriersBanners}
        />
      </Box>
      <Switch>
        <Route path={`${path}/:bannerId`}>
          <BannerDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default BannersPage;
