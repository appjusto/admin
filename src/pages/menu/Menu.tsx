import {
  Box,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useContextMenu } from 'app/state/menu/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { FilterText } from 'common/components/backoffice/FilterText';
import { NewFeatureBox } from 'common/components/NewFeatureBox';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { BsChat } from 'react-icons/bs';
import {
  Link as RouterLink,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
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
import { ImportMenuCard } from './ImportMenuCard';
import { MainButtons } from './MainButtons';

const Menu = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { isBackofficeUser } = useContextStaffProfile();
  const { business } = useContextBusiness();
  const {
    setIsMenuActive,
    isProductsPage,
    setIsProductPage,
    integrationStatus,
    userCanCreateMenu,
  } = useContextMenu();
  // state
  const [productSearch, setProductSearch] = React.useState('');
  // helpers
  const menuSource = integrationStatus?.source
    ? integrationStatus.source.charAt(0).toUpperCase() +
      integrationStatus.source.slice(1)
    : undefined;
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
        <PageHeader
          title={t('Cardápio')}
          subtitle={t('Defina o cardápio do seu restaurante.')}
        />
        {isBackofficeUser && !business?.enabled && (
          <ImportMenuCard businessId={business?.id} />
        )}
        <NewFeatureBox
          icon={BsChat}
          title={t('Adicionar mensagem para seus clientes')}
          description={t(
            'Adicione uma mensagem fixa como primeiro item dentro do seu cardápio.'
          )}
          button={{
            link: `${path}/message`,
            label: t('Adicionar mensagem'),
          }}
          isNew={false}
        />
        {!integrationStatus?.isReadOnly ? (
          <NewFeatureBox
            mt="6"
            title={t('Importar cardápio do Hubster')}
            description={
              <Box color="black" minW="140px">
                <Text mt="2">
                  {t(
                    'Se você usa o centralizador de pedidos do Hubster, agora você pode importar o cardápio e fazer sua gestão por lá!'
                  )}
                </Text>
                <Text>
                  {t('Vá até a página de ')}
                  <Link
                    as={RouterLink}
                    to={`/app/integrations/hubster`}
                    textDecor="underline"
                  >
                    {t('integrações')}
                  </Link>
                  {t(
                    ' e siga os passos para ativar sua intergração de cardápio.'
                  )}
                </Text>
              </Box>
            }
            isNew
          />
        ) : (
          <Flex
            mt="6"
            py="4"
            px="8"
            flexDir="row"
            border="1px solid black"
            borderRadius="lg"
            bgColor="yellow"
          >
            <Box>
              <Text mt="1" color="black" fontSize="md" fontWeight="700">
                {t('Seu cardápio está no modo leitura')}
              </Text>
              <Text
                color="black"
                minW="140px"
                fontSize="md"
                lineHeight="22px"
                fontWeight="500"
              >
                {t(
                  `Você optou por gerenciar o seu cardápio diretamente no ${menuSource}. Desse modo, não será possível realizar alterações por aqui.`
                )}
              </Text>
              <Text
                color="black"
                minW="140px"
                fontSize="md"
                lineHeight="22px"
                fontWeight="500"
              >
                {t(
                  'Para gerenciar o seu cardápio pelo AppJusto, vá até a tela de '
                )}
                <Link
                  as={RouterLink}
                  to={`/app/integrations/${integrationStatus.source}`}
                  textDecor="underline"
                >
                  {t('integrações')}
                </Link>
                {t(' e selecione a opção "Usar cardápio do AppJusto".')}
              </Text>
            </Box>
          </Flex>
        )}
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
        <Flex
          flexDir={{ base: 'column', lg: 'row' }}
          justifyContent={userCanCreateMenu ? 'space-between' : 'flex-end'}
          mt="2"
          mb="8"
        >
          <MainButtons
            isProducts={isProductsPage}
            display={userCanCreateMenu ? 'flex' : 'none'}
          />
          <InputGroup maxW="360px">
            <Input
              size="lg"
              mt="16px"
              value={productSearch}
              placeholder={
                isProductsPage
                  ? t('Encontre um produto')
                  : t('Encontre um complemento')
              }
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
