import React from 'react';
import PageLayout from 'pages/PageLayout';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Input,
  Spacer,
} from '@chakra-ui/react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import CategoryDrawer from './drawers/CategoryDrawer';

const Menu = () => {
  // context
  let { path, url } = useRouteMatch();
  const history = useHistory();

  // UI
  return (
    <PageLayout>
      <Container maxW="md">
        <Heading fontSize="lg" mt="4">
          Cardápio
        </Heading>
        <Text fontSize="sm">Defina o cardápio do seu restaurante.</Text>
        <Box mt="6" d="flex">
          <Link to={`${url}/category/new`}>
            <Button>Adicionar categoria</Button>
          </Link>

          <Link to={`${url}/product/new`}>
            <Button variant="outline" ml="2">
              Adicionar produto
            </Button>
          </Link>
          <Spacer />
          <Input ml="32" placeholder="Encontre um produto adicionado" />
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
