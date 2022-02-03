import { Button, ButtonProps, Icon } from '@chakra-ui/react';
import { BiSearch } from 'react-icons/bi';
import { t } from 'utils/i18n';

export const SearchButton = ({ ...props }: ButtonProps) => {
  return (
    <Button h="60px" px="10" fontSize="15px" {...props}>
      <Icon as={BiSearch} mr="1" />
      {t('Buscar')}
    </Button>
  );
};
