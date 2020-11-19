import { Box, Button, Container, Heading, Input, Spacer, Text } from '@chakra-ui/react';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Categories } from './Categories';
import { CategoryDrawer } from './drawers/CategoryDrawer';
import { ProductDrawer } from './drawers/ProductDrawer';

const Menu = () => {
  // context
  const { path, url } = useRouteMatch();
  const history = useHistory();

  // handler
  const closeDrawerHandler = () => history.replace(path);

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

          <Link to={`${url}/category/hardcoded/product/new`}>
            <Button variant="outline" ml="2">
              {t('Adicionar produto')}
            </Button>
          </Link>
          <Spacer />
          <Input ml="32" placeholder={t('Encontre um produto adicionado')} />
        </Box>
        <Box mt="2">
          <Categories />
        </Box>
      </Container>
      <Switch>
        <Route path={`${path}/category/:categoryId/product/:productId`}>
          <ProductDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/category/:categoryId`}>
          <CategoryDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </PageLayout>
  );
};

export default Menu;
