import { Box, Heading } from '@chakra-ui/react';
import { useProductsQuery } from 'app/api/menu/useProductsQuery';
import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { ProductItem } from '../ProductItem';

interface Props {
  category: WithId<Category>;
}

export const CategoryItem = ({ category }: Props) => {
  const { data } = useProductsQuery(category.id);

  return (
    <Box>
      <Heading>{category.name}</Heading>
      {data && data.map((product) => <ProductItem key={product.id} product={product} />)}
    </Box>
  );
};
