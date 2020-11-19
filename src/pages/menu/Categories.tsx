import { Box } from '@chakra-ui/react';
import { useCategories } from 'app/api/menu/useCategories';
import React from 'react';
import { CategoryItem } from './categories/CategoryItem';

export const Categories = () => {
  const categories = useCategories();

  return (
    <Box>
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </Box>
  );
};
