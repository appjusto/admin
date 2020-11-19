import { Box, Button, Container, Heading, Input, Spacer, Text } from '@chakra-ui/react';
import { useProfile } from 'app/state/profile/context';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { CategoryDrawer } from './drawers/CategoryDrawer';

const Menu = () => {
  // context
  const profile = useProfile();
  const { path, url } = useRouteMatch();
  const history = useHistory();

  console.log(profile);

  // UI
  return (
    <PageLayout>
      <Container maxW="md">
        <Heading fontSize="lg" mt="4">
          {t('Cardápio')}
        </Heading>
        <Text fontSize="sm">{t('Defina o cardápio do seu restaurante.')}</Text>
        <Box mt="6" d="flex">
          <Link to={`${url}/category/new`}>
            <Button>{t('Adicionar categoria')}</Button>
          </Link>

          <Link to={`${url}/product/new`}>
            <Button variant="outline" ml="2">
              {t('Adicionar produto')}
            </Button>
          </Link>
          <Spacer />
          <Input ml="32" placeholder={t('Encontre um produto adicionado')} />
        </Box>
      </Container>
      <Switch>
        <Route path={`${path}/category/:id`}>
          <CategoryDrawer isOpen onClose={() => history.replace(path)} />
        </Route>
      </Switch>
    </PageLayout>
  );
};

export default Menu;
