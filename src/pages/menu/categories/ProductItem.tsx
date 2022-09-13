import { Product, WithId } from '@appjusto/types';
import {
  Box,
  Flex,
  Image,
  Link,
  Spacer,
  Switch,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useProductImage } from 'app/api/business/products/useProductImage';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { EditButton } from 'common/components/buttons/EditButton';
import { ImageFbLoading } from 'common/components/ImageFbLoading';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { slugfyName } from 'utils/functions';
import { t } from 'utils/i18n';
import { CurrencyInput } from '../../../common/components/form/input/currency-input/CurrencyInput';

interface Props {
  product: WithId<Product>;
  index: number;
}

export const ProductItem = React.memo(({ product, index }: Props) => {
  // context
  const { url } = useRouteMatch();
  const api = useContextApi();
  const businessId = useContextBusinessId();
  const hookImageUrl = useProductImage(product.id, '288x288');
  //state
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [price, setPrice] = React.useState(0);

  //handlres
  const updatePriceState = (value: number | undefined) => {
    if (value || value === 0) setPrice(value);
  };

  const onUpdateProduct = async (key: string, value: number | boolean) => {
    const productData = {
      [key]: value,
    };
    await api
      .business()
      .updateProduct(businessId!, product.id, productData, null);
  };

  //side effects
  React.useEffect(() => {
    if (!product?.imageExists)
      setImageUrl('/static/media/product-placeholder.png');
    else if (hookImageUrl) setImageUrl(hookImageUrl);
  }, [product?.imageExists, hookImageUrl]);

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
          pos="relative"
          minW="700px"
        >
          <Box
            mr="4"
            bg="white"
            {...draggable.dragHandleProps}
            ref={draggable.innerRef}
          >
            <DragHandle />
          </Box>
          <Link
            as={RouterLink}
            to={`${url}/product/${product.id}`}
            width="96px"
            minW="96px"
            height="96px"
            _focus={{ outline: 'none' }}
          >
            <Image
              src={imageUrl}
              width="100%"
              objectFit="cover"
              borderRadius="lg"
              alt="Product image"
              fallback={<ImageFbLoading width="96px" height="96px" />}
            />
          </Link>
          <Flex w="100%" justifyContent="space-between" px="8">
            <Box bg="white" mr="2">
              <Text fontSize="lg" fontWeight="bold">
                {product.name}
              </Text>
              <Text fontSize="sm">{product.description}</Text>
            </Box>
            <Flex w="120px" minW="120px" alignItems="center">
              <CurrencyInput
                mt="0"
                id={`prod-${product.id}-price`}
                label={t('Preço')}
                value={price}
                onChangeValue={updatePriceState}
                onBlur={() => onUpdateProduct('price', price)}
                maxLength={6}
              />
            </Flex>
          </Flex>
          <Spacer />
          <Switch
            isChecked={product.enabled}
            onChange={(ev) => {
              ev.stopPropagation();
              onUpdateProduct('enabled', ev.target.checked);
            }}
          />
          <Link as={RouterLink} to={`${url}/product/${product.id}`}>
            <Tooltip
              placement="top"
              label={t('Editar')}
              aria-label={t('Editar')}
            >
              <EditButton
                aria-label={`editar-produto-${slugfyName(product.name)}`}
              />
            </Tooltip>
          </Link>
        </Flex>
      )}
    </Draggable>
  );
});
