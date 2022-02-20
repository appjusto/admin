import { Category, Product, WithId } from '@appjusto/types';
import { Box, Flex, Heading, Spacer, Switch, Tooltip } from '@chakra-ui/react';
import { useCategory } from 'app/api/business/categories/useCategory';
import { CustomButton as Button } from 'common/components/buttons/CustomButton';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { slugfyName } from 'utils/functions';
import { t } from 'utils/i18n';
import { ProductItem } from './ProductItem';

interface Props {
  category: WithId<Category>;
  products: WithId<Product>[];
  index: number;
  hidden?: boolean;
  url: string;
}

export const CategoryItem = React.memo(({ category, products, index, hidden, url }: Props) => {
  // mutations
  const { updateCategory } = useCategory(category.id);
  // UI
  return (
    <Draggable draggableId={category.id} index={index}>
      {(draggable) => (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          boxShadow="0px 8px 16px -4px rgba(105, 118, 103, 0.1)"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
          p="6"
          mb="6"
          d={hidden ? 'none' : 'block'}
          w="100%"
        >
          <Flex alignItems="center" mb="6">
            <Box bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
              <DragHandle />
            </Box>
            <Heading fontSize="3xl" ml="4">
              {category.name}
            </Heading>
            <Spacer />
            <Switch
              isChecked={category.enabled}
              onChange={(ev) => {
                ev.stopPropagation();
                updateCategory({ enabled: ev.target.checked });
              }}
            />
            <Link to={`${url}/category/${category.id}`}>
              <Tooltip placement="top" label={t('Editar')} aria-label={t('Editar')}>
                <EditButton aria-label={`editar-categoria-${slugfyName(category.name)}`} />
              </Tooltip>
            </Link>
          </Flex>
          <Droppable droppableId={category.id} type="product">
            {(droppable, snapshot) => (
              <Box
                ref={droppable.innerRef}
                {...droppable.droppableProps}
                bg={snapshot.isDraggingOver ? 'gray.50' : 'white'}
                minH={100}
                w="100%"
                overflow="auto"
              >
                {products &&
                  products.map((product, index) => (
                    <ProductItem key={product.id} product={product} index={index} />
                  ))}
                {droppable.placeholder}
              </Box>
            )}
          </Droppable>
          <Button
            mt="0"
            w={{ base: '100%', md: '300px' }}
            link={`${url}/product/new?categoryId=${category.id}`}
            label={t('Adicionar produto à categoria')}
            aria-label={`adicionar-produto-${slugfyName(category.name)}`}
            variant="outline"
          />
        </Box>
      )}
    </Draggable>
  );
});
