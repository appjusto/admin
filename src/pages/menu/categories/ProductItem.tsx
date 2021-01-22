import { Box, Flex, Spacer, Switch, Text, Tooltip } from '@chakra-ui/react';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { Product, WithId } from 'appjusto-types';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { CurrencyInput } from '../../../common/components/form/input/currency-input/CurrencyInput2';
import Image from './../../../common/components/Image';

interface Props {
  product: WithId<Product>;
  index: number;
}

export const ProductItem = React.memo(({ product, index }: Props) => {
  // context
  const { url } = useRouteMatch();
  const api = useContextApi();
  const businessId = useContextBusinessId();
  //state
  const [price, setPrice] = React.useState(0);
  const srcImg = product.image_url ? product.image_url : '/static/media/product-placeholder.png';

  //handlres
  const updatePriceState = (value: number | undefined) => {
    if (value || value === 0) setPrice(value);
  };

  const onUpdateProduct = async (key: string, value: number | boolean) => {
    const productData = {
      [key]: value,
    };
    await api.business().updateProduct(businessId!, product.id, productData, null);
  };
  //side effects
  React.useEffect(() => {
    updatePriceState(product.price);
  }, [product.price]);
  // UI
  return (
    <Draggable draggableId={product.id} index={index}>
      {(draggable, snapshot) => (
        <Flex
          bg="white"
          mb="4"
          borderWidth="1px"
          borderRadius="lg"
          alignItems="center"
          p="2"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
        >
          <Box bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
            <DragHandle />
          </Box>
          <Link to={`${url}/product/${product.id}`}>
            <Image
              marginX="4"
              src={srcImg}
              boxSize="24"
              objectFit="contain"
              borderRadius="lg"
              alt="Product image"
            />
          </Link>
          <Flex w="100%" justifyContent="space-between" px="8">
            <Box bg="white" mr="2">
              <Text fontSize="lg" fontWeight="bold">
                {product.name}
              </Text>
              <Text fontSize="sm">{product.description}</Text>
            </Box>
            <Box maxW="120px">
              <CurrencyInput
                mt="0"
                id={`prod-${product.id}-price`}
                label={t('Preço')}
                value={price}
                onChangeValue={updatePriceState}
                onBlur={() => onUpdateProduct('price', price)}
              />
            </Box>
          </Flex>
          <Spacer />
          <Switch
            isChecked={product.enabled}
            onChange={(ev) => {
              ev.stopPropagation();
              onUpdateProduct('enabled', ev.target.checked);
            }}
          />
          <Link to={`${url}/product/${product.id}`}>
            <Tooltip placement="top" label={t('Editar')} aria-label={t('Editar')}>
              <EditButton />
            </Tooltip>
          </Link>
        </Flex>
      )}
    </Draggable>
  );
});
