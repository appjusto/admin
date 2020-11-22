import { Box, Button, Container, Heading, Input, Spacer, Text } from '@chakra-ui/react';
import { useMenuConfig } from 'app/api/menu/useMenuConfig';
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

  // state
  const { menuConfig } = useMenuConfig();
  const lastCategory = menuConfig.categoriesOrder[menuConfig.categoriesOrder.length - 1];

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

          <Link to={`${url}/category/${lastCategory}/product/new`}>
            <Button variant="outline" ml="2" isDisabled={!lastCategory}>
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
