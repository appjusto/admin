import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useImportMenu } from 'app/api/business/menu/useImportMenu';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import React from 'react';
import { t } from 'utils/i18n';

interface ImportMenuCardProps {
  businessId?: string | null;
}

export const ImportMenuCard = ({ businessId }: ImportMenuCardProps) => {
  // context
  const { importMenu, importMenuResult } = useImportMenu(businessId);
  const { dispatchAppRequestResult } = useContextAppRequests();
  // state
  const [menuUrl, setMenuUrl] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  // handlers
  const handleDiscount = (value: number) => {
    if (value > 100) return;
    if (!value) return setDiscount(0);
    setDiscount(value);
  };
  const handleImport = async () => {
    if (!businessId) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'handle-import-error',
        message: {
          title:
            'Não foi possível encontrar as informações sobre o restaurante.',
        },
      });
    }
    if (!menuUrl || discount === undefined) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'handle-import-error',
        message: { title: 'Parâmetros inválidos.' },
      });
    }
    importMenu({ url: menuUrl, discount });
  };
  // UI
  return (
    <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" p="4">
      <Text color="black" fontSize="18px" lineHeight="26px" fontWeight="700">
        {t('Importar cardápio externo:')}
      </Text>
      <Stack mt="4" spacing={4} direction={{ base: 'column', md: 'row' }}>
        <CustomInput
          mt="0"
          id="menu-url"
          label={t('Url do cardápio')}
          placeholder={t('Informe a Url completa do cardápio. Ex: https://...')}
          value={menuUrl}
          onChange={(ev) => setMenuUrl(ev.target.value)}
        />
        <NumberInput
          isRequired
          id="menu-discount"
          maxW="200px"
          label={t('Percentual de desconto')}
          value={discount.toString()}
          onChange={(ev) => handleDiscount(parseInt(ev.target.value))}
        />
        <Button
          h="60px"
          minW="120px"
          variant="secondary"
          onClick={handleImport}
          loadingText={t('Importando')}
          isLoading={importMenuResult.isLoading}
          isDisabled={!menuUrl}
        >
          {t('Importar')}
        </Button>
      </Stack>
    </Box>
  );
};
