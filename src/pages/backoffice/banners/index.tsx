import { Box } from '@chakra-ui/react';
import { useObserveBannersByFlavor } from 'app/api/banners/useObserveBannersByFlavor';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BannerDrawer } from '../drawers/banner';
import { BannersGroups } from './BannersGroup';

const BannersPage = () => {
  // state
  const [dateTime, setDateTime] = React.useState('');
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const consumersBanners = useObserveBannersByFlavor('consumer');
  const businessesBanners = useObserveBannersByFlavor('business');
  const couriersBanners = useObserveBannersByFlavor('courier');
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
      <CustomButton mt="4" label={t('Criar banner')} link={`${path}/new`} />
      <Box>
        <BannersGroups title={t('Consumidores')} banners={consumersBanners} />
        <BannersGroups title={t('Restaurantes')} banners={businessesBanners} />
        <BannersGroups title={t('Entregadores')} banners={couriersBanners} />
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
