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
      pb={{ base: '2', md: '0' }}
      minW={{ base: '82px', lg: '124px' }}
      color="#697667"
      cursor="pointer"
      onClick={clearFunction}
      {...props}
    >
      <DeleteIcon />
      <Text fontSize="15px" lineHeight="21px" display={{ base: 'none', lg: 'block' }}>
        {t('Limpar filtros')}
      </Text>
      <Text fontSize="15px" lineHeight="21px" display={{ base: 'block', lg: 'none' }}>
        {t('Limpar')}
      </Text>
    </HStack>
  );
};
