import { Box, Flex, HStack, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { FilterText } from 'common/components/backoffice/FilterText';
import { NewFeatureBox } from 'common/components/NewFeatureBox';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { BsChat } from 'react-icons/bs';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Categories } from './categories/Categories';
import { Complements } from './complements/Complements';
import { ProductContextProvider } from './context/ProductContext';
import { CategoryDrawer } from './drawers/CategoryDrawer';
import { ComplementDrawer } from './drawers/ComplementDrawer';
import { GroupDrawer } from './drawers/GroupDrawer';
import { GroupDuplicationDrawer } from './drawers/GroupDuplicationDrawer';
import { MessageDrawer } from './drawers/MessageDrawer';
import { ProductDrawer } from './drawers/ProductDrawer';
import { MainButtons } from './MainButtons';

const Menu = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { setIsMenuActive, isProductsPage, setIsProductPage } = useContextMenu();
  // state
  const [productSearch, setProductSearch] = React.useState('');
  // handler
  const closeDrawerHandler = () => history.replace(path);
  // side effects
  React.useEffect(() => {
    setIsMenuActive(true);
  }, [setIsMenuActive]);
  // UI
  return (
    <Box>
      <Box pb="10">
        <PageHeader title={t('Cardápio')} subtitle={t('Defina o cardápio do seu restaurante.')} />
        <NewFeatureBox
          icon={BsChat}
          title={t('Adicionar mensagem para seus clientes')}
          description={t('Adicione uma mensagem fixa como primeiro item dentro do seu cardápio.')}
          link={`${path}/message`}
          btnLabel={t('Adicionar mensagem')}
          isNew={false}
        />
        <Box mt="2">
          <Flex
            mt="8"
            mb="4"
            w="100%"
            justifyContent="space-between"
            borderBottom="1px solid #C8D7CB"
          >
            <HStack spacing={4}>
              <FilterText
                isActive={isProductsPage}
                label={t('Produtos')}
                onClick={() => {
                  closeDrawerHandler();
                  setIsProductPage(true);
                }}
              />
              <FilterText
                isActive={!isProductsPage}
                label={t('Complementos')}
                onClick={() => setIsProductPage(false)}
              />
            </HStack>
          </Flex>
        </Box>
        <Flex flexDir={{ base: 'column', lg: 'row' }} justifyContent="space-between" mt="2" mb="8">
          <MainButtons isProducts={isProductsPage} />
          <InputGroup maxW="360px">
            <Input
              size="lg"
              mt="16px"
              value={productSearch}
              placeholder={isProductsPage ? t('Encontre um produto') : t('Encontre um complemento')}
              onChange={(ev) => setProductSearch(ev.target.value)}
            />
            <InputRightElement
              mt="20px"
              mr="8px"
              children={<Icon w="22px" h="22px" as={SearchIcon} />}
            />
          </InputGroup>
        </Flex>
        {isProductsPage ? (
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
        <Route path={`${path}/complementsgroup-duplication/:groupId`}>
          <GroupDuplicationDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/complement/:complementId`}>
          <ComplementDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/message`}>
          <MessageDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </Box>
  );
};

export default Menu;
