import { DeleteIcon } from '@chakra-ui/icons';
import { HStack, StackProps, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface ClearFiltersButtonProps extends StackProps {
  clearFunction(): void;
}

export const ClearFiltersButton = ({ clearFunction, ...props }: ClearFiltersButtonProps) => {
  // UI
  return (
    <HStack
      spacing={2}
      pl="2"
      pb="2"
      color="#697667"
      cursor="pointer"
      onClick={clearFunction}
      {...props}
    >
      <DeleteIcon />
      <Text fontSize="15px" lineHeight="21px" display={{ base: 'none', md: 'block' }}>
        {t('Limpar busca/filtros')}
      </Text>
      <Text fontSize="15px" lineHeight="21px" display={{ base: 'block', md: 'none' }}>
        {t('Limpar')}
      </Text>
    </HStack>
  );
};
