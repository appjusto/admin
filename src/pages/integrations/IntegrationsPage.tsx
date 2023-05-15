import { Box } from '@chakra-ui/react';
import hubsterLogo from 'common/img/hubster-logo.png';
import PageHeader from 'pages/PageHeader';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { HubsterDrawer } from './HubsterDrawer';
import { ServiceCard } from './ServiceCard';

const IntegrationsPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  // UI
  return (
    <>
      <Box>
        <PageHeader
          title={t('Integrações')}
          subtitle={t(
            'Ative as integrações com o seu centralizador de pedidos ou PDV '
          )}
        />
        <Box maxW="468px" pt="18px">
          <ServiceCard
            logo={hubsterLogo}
            name="Hubster"
            enabled={true}
            link="integrations/hubster"
          />
        </Box>
      </Box>
      <Switch>
        <Route path={`${path}/hubster`}>
          <HubsterDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default IntegrationsPage;
