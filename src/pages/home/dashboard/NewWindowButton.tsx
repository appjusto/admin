import { Icon, Link, Tooltip } from '@chakra-ui/react';
import { MdOpenInNew } from 'react-icons/md';
import { t } from 'utils/i18n';

export const NewWindowButton = () => {
  return (
    <Tooltip label={t('Abrir nova janela')}>
      <Link
        border="1px solid #E5E5E5"
        borderRadius="lg"
        px="1"
        h="23px"
        _hover={{
          color: 'white',
          bgColor: '#505A4F',
        }}
        href="/app"
        isExternal
      >
        <Icon as={MdOpenInNew} />
      </Link>
    </Tooltip>
  );
};
