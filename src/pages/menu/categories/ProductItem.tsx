import { Box, Flex, Spacer, Switch, Text } from '@chakra-ui/react';
import { useProductImage } from 'app/api/business/products/useProductImage';
import { useProductUpdate } from 'app/api/business/products/useProductUpdate';
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
  //state
  const [price, setPrice] = React.useState(0);
  // queries
  const image = useProductImage(product.id);
  const srcImg = image ? image : '/static/media/product-placeholder.png';
  // mutations
  const { updateProduct } = useProductUpdate(product.id);
  //handlres
  const updatePriceState = (value: number | undefined) => {
    if (value || value === 0) setPrice(value);
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
                onBlur={() => updateProduct({ price: price })}
              />
            </Box>
          </Flex>
          <Spacer />
          <Switch
            isChecked={product.enabled}
            onChange={(ev) => {
              ev.stopPropagation();
              updateProduct({ enabled: ev.target.checked });
            }}
          />
          <Link to={`${url}/product/${product.id}`}>
            <EditButton />
          </Link>
        </Flex>
      )}
    </Draggable>
  );
});
