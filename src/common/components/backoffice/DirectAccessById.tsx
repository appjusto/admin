import { Box, BoxProps, Button, Icon, Link, Stack, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { VscOpenPreview } from 'react-icons/vsc';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { CustomInput } from '../form/input/CustomInput';
import { Select } from '../form/select/Select';

type DataType = 'order' | 'business' | 'courier' | 'consumer' | 'invoice';

export const DirectAccessById = ({ ...props }: BoxProps) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { url } = useRouteMatch();
  // state
  const [type, setType] = React.useState<DataType>('order');
  const [searchId, setSearchId] = React.useState('');
  const [dynamicLink, setDynamicLink] = React.useState<string>();
  // side effects
  React.useEffect(() => {
    if (!type || !searchId) {
      setDynamicLink(undefined);
      return;
    }
    setDynamicLink(`${type}/${searchId}`);
  }, [type, searchId]);
  // UI
  return (
    <Box mt="4" border="1px solid #F6F6F6" borderRadius="lg" py="6" px="8" {...props}>
      <Text fontSize="20px" fontWeight="500" color="black">
        {t('Acesso direto:')}
      </Text>
      <Stack mt="2" direction={{ base: 'column', md: 'row' }}>
        <Select
          mt="0"
          maxW={{ md: '140px' }}
          label={t('Tipo de dado:')}
          value={type}
          onChange={(e) => setType(e.target.value as DataType)}
        >
          {userAbility?.can('read', 'orders') && <option value="order">{t('Pedido')}</option>}
          {userAbility?.can('read', 'couriers') && (
            <option value="courier">{t('Entregador')}</option>
          )}
          {userAbility?.can('read', 'businesses') && (
            <option value="business">{t('Restaurante')}</option>
          )}
          {userAbility?.can('read', 'consumers') && (
            <option value="consumer">{t('Consumidor')}</option>
          )}
          {userAbility?.can('read', 'invoices') && <option value="invoice">{t('Fatura')}</option>}
        </Select>
        <CustomInput
          mt="0"
          maxW={{ md: '220px' }}
          id="direct-access-search"
          value={searchId}
          onChange={(event) => setSearchId(event.target.value)}
          label={type === 'order' ? t('Id ou código:') : t('Id:')}
          placeholder={t('Digite o id')}
        />
        <Link
          as={RouterLink}
          to={dynamicLink ? `${url}/${dynamicLink}` : url}
          _hover={{ textDecor: 'none' }}
        >
          <Button w={{ base: '100%', md: 'auto' }} h="60px" isDisabled={!searchId}>
            <Icon as={VscOpenPreview} me="1" />
            {t('Abrir')}
          </Button>
        </Link>
      </Stack>
    </Box>
  );
};
