import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { useProductContext } from '../context/ProductContext';
import { DrawerButtons } from './DrawerButtons';
import { DrawerLink } from './DrawerLink';
import { ProductAvailability } from './product/ProductAvailability';
import { ProductComplements } from './product/ProductComplements';
import { ProductDetails } from './product/ProductDetails';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

export const ProductDrawer = (props: Props) => {
  // params
  const { path, url } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  const {
    productId,
    onProductUpdate,
    updateProductResult,
    deleteProduct,
    deleteProductResult,
  } = useProductContext();
  const { onClose } = props;
  // helpers
  const title = productId === 'new' ? 'Adicionar produto' : 'Alterar produto';
  //handlers
  const handleSubmit = async () => {
    const result = await onProductUpdate();
    if (result === 'close_drawer') onClose();
  };
  const handleDelete = () => {
    if (!productId || productId === 'new') return;
    deleteProduct();
  };
  // side effects
  React.useEffect(() => {
    if (deleteProductResult.isSuccess) {
      onClose();
    }
  }, [onClose, deleteProductResult.isSuccess]);
  // UI
  return (
    <Drawer placement="right" size="lg" {...props}>
      <DrawerOverlay>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
          }}
        >
          <DrawerContent
            mt={{ base: '16', lg: '0' }}
            pt={isBackofficeUser ? '20' : 0}
          >
            <DrawerCloseButton />
            <DrawerHeader borderBottom="1px solid #C8D7CB" pb="0" mb="8">
              <Text fontSize="2xl" fontWeight="700">
                {t(title)}
              </Text>
              <Flex
                fontSize="sm"
                mt="4"
                flexDir="row"
                alignItems="flex-start"
                overflowX="auto"
              >
                <DrawerLink to={`${url}`} label="Detalhes" />
                <DrawerLink
                  to={`${url}/complements`}
                  label="Complementos"
                  isDisabled={url.includes('new')}
                />
                <DrawerLink
                  to={`${url}/availability`}
                  label="Disponibilidade"
                  isDisabled={url.includes('new')}
                />
              </Flex>
            </DrawerHeader>
            <DrawerBody pb="28">
              <Switch>
                <Route exact path={`${path}`}>
                  <ProductDetails />
                </Route>
                <Route exact path={`${path}/complements`}>
                  <ProductComplements />
                </Route>
                <Route exact path={`${path}/availability`}>
                  <ProductAvailability />
                </Route>
              </Switch>
            </DrawerBody>
            <DrawerFooter>
              <DrawerButtons
                type="produto"
                isEditing={productId !== 'new'}
                onDelete={handleDelete}
                isLoading={updateProductResult.isLoading}
                deletingLoading={deleteProductResult.isLoading}
              />
            </DrawerFooter>
          </DrawerContent>
        </form>
      </DrawerOverlay>
    </Drawer>
  );
};
