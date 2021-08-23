import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { useProductContext } from '../context/ProductContext';
import { BaseDrawer } from './BaseDrawer';
import { ProductAvailability } from './product/ProductAvailability';
import { ProductComplements } from './product/ProductComplements';
import { ProductDetails } from './product/ProductDetails';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

export const ProductDrawer = (props: Props) => {
  // params
  const { productId } = useProductContext();
  const { path } = useRouteMatch();
  //props
  const { onClose } = props;
  // UI
  return (
    <BaseDrawer
      {...props}
      type="product"
      title={productId === 'new' ? t('Adicionar produto') : t('Alterar produto')}
      isError={false}
      error={null}
    >
      <Switch>
        <Route exact path={`${path}`}>
          <ProductDetails onClose={onClose} />
        </Route>
        <Route exact path={`${path}/complements`}>
          <ProductComplements />
        </Route>
        <Route exact path={`${path}/availability`}>
          <ProductAvailability />
        </Route>
      </Switch>
    </BaseDrawer>
  );
};
