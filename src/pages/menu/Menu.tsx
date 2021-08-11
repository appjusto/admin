import {
  Box,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import { MenuProvider } from 'app/state/menu/context';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomButton as Button } from 'common/components/buttons/CustomButton';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Categories } from './categories/Categories';
import { Complements } from './complements/Complements';
import { ProductContextProvider } from './context/ProductContext';
import { CategoryDrawer } from './drawers/CategoryDrawer';
import { ComplementDrawer } from './drawers/ComplementDrawer';
import { GroupDrawer } from './drawers/GroupDrawer';
import { ProductDrawer } from './drawers/ProductDrawer';

const Menu = () => {
  // context
  const { path, url } = useRouteMatch();
  const history = useHistory();
  // state
  const [isProducts, setIsProduct] = React.useState(true);
  const [productSearch, setProductSearch] = React.useState('');
  // handler
  const closeDrawerHandler = () => history.replace(path);
  // UI
  return (
    <MenuProvider>
      <Box pb="10">
        <PageHeader title={t('Cardápio')} subtitle={t('Defina o cardápio do seu restaurante.')} />
        <Box mt="2">
          <Flex
            mt="8"
            mb="4"
            w="100%"
            justifyContent="space-between"
            borderBottom="1px solid #C8D7CB"
          >
            <HStack spacing={4}>
              <FilterText isActive={isProducts} onClick={() => setIsProduct(true)}>
                {t('Produtos')}
              </FilterText>
              <FilterText isActive={!isProducts} onClick={() => setIsProduct(false)}>
                {t('Complementos')}
              </FilterText>
            </HStack>
          </Flex>
        </Box>
        <Flex flexDir={{ base: 'column', lg: 'row' }} justifyContent="space-between" mt="2" mb="8">
          <Stack mt="4" direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Button
              mt="0"
              minW="220px"
              w={{ base: '100%', md: 'auto' }}
              link={isProducts ? `${url}/category/new` : `${url}/complementsgroup/new`}
              label={isProducts ? t('Adicionar categoria') : t('Adicionar grupo')}
              variant="solid"
            />
            <Button
              mt="0"
              minW="220px"
              w={{ base: '100%', md: 'auto' }}
              link={isProducts ? `${url}/product/new` : `${url}/complement/new`}
              label={isProducts ? t('Adicionar produto') : t('Adicionar complemento')}
              variant="outline"
            />
          </Stack>
          <InputGroup maxW="360px">
            <Input
              size="lg"
              mt="16px"
              value={productSearch}
              placeholder={isProducts ? t('Encontre um produto') : t('Encontre um complemento')}
              onChange={(ev) => setProductSearch(ev.target.value)}
            />
            <InputRightElement
              mt="20px"
              mr="8px"
              children={<Icon w="22px" h="22px" as={SearchIcon} />}
            />
          </InputGroup>
        </Flex>
        {isProducts ? (
          <Categories productSearch={productSearch} />
        ) : (
          <Complements search={productSearch} />
        )}
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
        <Route path={`${path}/complementsgroup/:groupId`}>
          <GroupDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/complement/:complementId`}>
          <ComplementDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </MenuProvider>
  );
};

export default Menu;
