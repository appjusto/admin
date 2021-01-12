import { Box, Flex, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { MenuProvider } from 'app/state/menu/context';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { CustomButton as Button } from '../../common/components/buttons/CustomButton';
import { Categories } from './categories/Categories';
import { CategoryDrawer } from './drawers/CategoryDrawer';
import { ProductDrawer } from './drawers/ProductDrawer';
import { ReactComponent as SearchIcon } from './img/searchIcon.svg';

export const Menu = () => {
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
      <PageHeader title={t('Cardápio')} subtitle={t('Defina o cardápio do seu restaurante.')} />
      <Flex justifyContent="space-between" mt="2" mb="8">
        <Flex>
          <Button link={`${url}/category/new`} label={t('Adicionar categoria')} variant="solid" />
          <Button
            link={`${url}/product/new`}
            label={t('Adicionar produto')}
            variant="outline"
            ml="2"
          />
        </Flex>
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
            children={<Icon w="24px" h="24px" as={SearchIcon} />}
          />
        </InputGroup>
      </Flex>
      <Box mt="2" pb="10">
        <Categories productSearch={productSearch} />
      </Box>
      <Switch>
        <Route path={`${path}/product/:productId`}>
          <ProductDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/category/:categoryId`}>
          <CategoryDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </MenuProvider>
  );
};
