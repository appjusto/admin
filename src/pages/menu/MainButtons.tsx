import { Stack } from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { t } from 'utils/i18n';

interface MainButtonsProps {
  isProducts: boolean;
}

export const MainButtons = ({ isProducts }: MainButtonsProps) => {
  // context
  const { url } = useRouteMatch();
  const { categories } = useContextMenu();
  // helpers
  const isCategories = categories?.length > 0;
  // UI
  return (
    <Stack mt="4" direction={{ base: 'column', md: 'row' }} spacing={4}>
      <CustomButton
        mt="0"
        minW="220px"
        w={{ base: '100%', md: 'auto' }}
        link={isProducts ? `${url}/category/new` : `${url}/complementsgroup/new`}
        label={isProducts ? t('Adicionar categoria') : t('Adicionar grupo')}
        variant="solid"
      />
      {isProducts && (
        <CustomButton
          mt="0"
          minW="220px"
          w={{ base: '100%', md: 'auto' }}
          link={`${url}/product/new`}
          label={t('Adicionar produto')}
          variant="outline"
          isDisabled={!isCategories}
        />
      )}
    </Stack>
  );
};
