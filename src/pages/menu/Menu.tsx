import { Box, Flex, Icon, Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';
import { MenuProvider } from 'app/state/menu/context';
import { CustomButton as Button } from 'common/components/buttons/CustomButton';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Categories } from './categories/Categories';
import { ProductContextProvider } from './context/ProductContext';
import { CategoryDrawer } from './drawers/CategoryDrawer';
import { ProductDrawer } from './drawers/ProductDrawer';

const Menu = () => {
  // context
  const { path, url } = useRouteMatch();
  const history = useHistory();
  // state
  const [productSearch, setProductSearch] = React.useState('');
  // handler
  const closeDrawerHandler = () => history.replace(path);
  // UI
  return (
    <MenuProvider>
      <Box pb="10">
        <PageHeader title={t('Cardápio')} subtitle={t('Defina o cardápio do seu restaurante.')} />
        <Flex flexDir={{ base: 'column', lg: 'row' }} justifyContent="space-between" mt="2" mb="8">
          <Stack mt="4" direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Button
              mt="0"
              w={{ base: '100%', md: 'auto' }}
              link={`${url}/category/new`}
              label={t('Adicionar categoria')}
              variant="solid"
            />
            <Button
              mt="0"
              w={{ base: '100%', md: 'auto' }}
              link={`${url}/product/new`}
              label={t('Adicionar produto')}
              variant="outline"
            />
          </Stack>
          <InputGroup maxW="360px">
            <Input
              size="lg"
              mt="16px"
              value={productSearch}
              placeholder={t('Encontre um produto adicionado')}
              onChange={(ev) => setProductSearch(ev.target.value)}
            />
            <InputRightElement
              mt="20px"
              mr="8px"
              children={<Icon w="22px" h="22px" as={SearchIcon} />}
            />
          </InputGroup>
        </Flex>
        <Box mt="2">
          <Categories productSearch={productSearch} />
        </Box>
      </Box>
      <Switch>
        <Route path={`${path}/product/:productId`}>
          <ProductContextProvider>
            <ProductDrawer isOpen onClose={closeDrawerHandler} />
          </ProductContextProvider>
        </Route>
        <Route path={`${path}/category/:categoryId`}>
          <CategoryDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </MenuProvider>
  );
};

export default Menu;
