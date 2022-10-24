import { PlatformAccess } from '@appjusto/types';
import { Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface PlatformVersionsProps {
  currentVersions?: PlatformAccess['currentVersions'];
}

export const PlatformVersions = ({
  currentVersions,
}: PlatformVersionsProps) => {
  const { consumer, courier, businessWeb, businessApp } = currentVersions ?? {};
  return (
    <Box mt="4" border="1px solid #E5E5E5" borderRadius="lg" py="4" px="8">
      <Text fontSize="20px" fontWeight="500" color="black">
        {t('Versões da plataforma:')}
      </Text>
      {/* <Flex mt="2" flexDir="row" justifyContent="space-between"> */}
      <Wrap mt="2" justify="space-between">
        <WrapItem>
          <Text fontWeight="500">
            {t('App Consumidor: ')}
            <Text as="span" fontWeight="700">
              {consumer ?? 'N/E'}
            </Text>
          </Text>
        </WrapItem>
        <WrapItem>
          <Text fontWeight="500">
            {t('App Entregador: ')}
            <Text as="span" fontWeight="700">
              {courier ?? 'N/E'}
            </Text>
          </Text>
        </WrapItem>
        <WrapItem>
          <Text fontWeight="500">
            {t('Restaurantes web: ')}
            <Text as="span" fontWeight="700">
              {businessWeb ?? 'N/E'}
            </Text>
          </Text>
        </WrapItem>
        <WrapItem>
          <Text fontWeight="500">
            {t('Restaurante mobile: ')}
            <Text as="span" fontWeight="700">
              {businessApp ?? 'N/E'}
            </Text>
          </Text>
        </WrapItem>
      </Wrap>
    </Box>
  );
};
