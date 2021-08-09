import { Badge, Box, Button, HStack, Input, Text } from '@chakra-ui/react';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { slugify } from 'utils/formatters';
import { t } from 'utils/i18n';

interface DeeplinkProps {
  isEditable?: boolean;
}

export const Deeplink = ({ isEditable }: DeeplinkProps) => {
  // state
  const [slug, setSlug] = React.useState('');
  // UI
  return (
    <Box>
      <HStack mt="8" spacing={2}>
        <SectionTitle mt="0">{t('Divulgue diretamente o seu restaurante')}</SectionTitle>
        <Badge
          bg="#FFBE00"
          color="black"
          borderRadius="22px"
          px="3"
          py="1"
          fontSize="11px"
          lineHeight="lg"
          fontWeight="700"
        >
          {t('NOVIDADE')}
        </Badge>
      </HStack>
      <Text mt="4">
        {t(
          'Você pode compartilhar o acesso direto ao seu restaurante no AppJusto. Copie o link abaixo e divulgue nas suas redes!'
        )}
      </Text>
      {isEditable && (
        <CustomInput
          maxW="320px"
          id="custom-slug"
          label={t('Digite um slug')}
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          onBlur={(e) => setSlug(slugify(e.target.value, true))}
        />
      )}
      <Box mt="4" position="relative" h="60px">
        <Input
          w="100%"
          h="100%"
          bg="gray.50"
          border="1px solid #C8D7CB"
          color="gray.700"
          value={t('https://l.deeplink.appjusto.com.br/consumer/r?slug=nome-do-restaurante')}
          onChange={() => {}}
        />
        <HStack position="absolute" top="6px" right="2">
          <Button fontSize="sm">{t('Copiar link')}</Button>
          <Button variant="secondary" fontSize="sm">
            {t('Enviar para o WhatsApp')}
          </Button>
        </HStack>
      </Box>
      <Text mt="4" fontSize="xs">
        {t(
          'Ao clicar, seus clientes entrarão direto no seu restaurante dentro do app. Caso ainda não tenham o app instalado, exibiremos uma página com as informações de contato do restaurante, e informaremos para baixarem o app antes de realizarem os pedidos.'
        )}
      </Text>
    </Box>
  );
};
