import { Box, Button, HStack, Input, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { slugify } from 'utils/formatters';
import { t } from 'utils/i18n';

const SharingPage = () => {
  // context
  const { business } = useContextBusiness();
  const { updateBusinessSlug, updateSlugResult } = useBusinessProfile();
  const { isLoading, isSuccess, isError, error: updateError } = updateSlugResult;
  // state
  const [slug, setSlug] = React.useState('');
  const [deeplink, setDeeplink] = React.useState('');
  const [isCopied, setIsCopied] = React.useState(false);
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
  // handlers
  const copyToClipboard = (mode?: 'whatsapp' | 'in-store') => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    return navigator.clipboard.writeText(`${deeplink}${mode ? `?mode=${mode}` : ''}`);
  };
  const handleUpdate = () => {
    if (!business?.id || !slug) return;
    setError(initialError);
    submission.current += 1;
    updateBusinessSlug({ businessId: business.id, slug });
  };
  // side effects
  React.useEffect(() => {
    if (!business?.slug) {
      if (business?.name) setSlug(slugify(business?.name));
    } else {
      const deeplink =
        process.env.REACT_APP_ENVIRONMENT === 'live'
          ? `https://appjusto.com.br/r/${business.slug}`
          : `https://${process.env.REACT_APP_ENVIRONMENT}.appjusto.com.br/r/${business.slug}`;
      setSlug(business.slug);
      setDeeplink(deeplink);
    }
  }, [business?.slug, business?.name]);
  React.useEffect(() => {
    if (isError) {
      const error = (updateError as unknown) as Error;
      setError({
        status: true,
        error: updateError,
        message: {
          title: error?.message ? error.message : 'Não foi possível salvar o identificador',
        },
      });
    }
  }, [isError, updateError]);
  // UI
  return (
    <Box>
      <PageHeader
        title={t('Compartilhamento')}
        subtitle={t('Crie e gerencie os seus links de compartilhamento.')}
      />
      <SectionTitle mt="8">{t('Divulgue diretamente o seu restaurante')}</SectionTitle>
      <Text mt="4">
        {t(
          'Você pode compartilhar o acesso direto ao seu restaurante no AppJusto. Crie um identificador, com a sugestão abaixo ou digitando à sua escolha e clicando em salvar, depois copie o link gerado e divulgue nas suas redes!'
        )}
      </Text>
      <HStack mt="4" spacing={2}>
        <CustomInput
          mt="0"
          maxW="320px"
          id="custom-slug"
          label={t('Identificador do restaurante')}
          placeholder={t('Digite um identificador')}
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          onBlur={(e) => setSlug(slugify(e.target.value, true))}
        />
        <Button h="60px" minW="120px" onClick={handleUpdate} isLoading={isLoading}>
          {t('Salvar')}
        </Button>
      </HStack>
      {business?.slug && (
        <Box>
          <Text mt="8" fontSize="18px" fontWeight="500" lineHeight="22px" color="black">
            {t('Link com botão para pedir no AppJusto')}
          </Text>
          <Box mt="4" position="relative" h="60px">
            <Input
              w="100%"
              h="100%"
              pr="350px"
              bg="gray.50"
              border="1px solid #C8D7CB"
              color="gray.700"
              value={deeplink}
              onChange={() => {}}
              zIndex="100"
            />
            <HStack position="absolute" top="6px" right="2" zIndex="999">
              <Button fontSize="sm" onClick={() => copyToClipboard()}>
                {isCopied ? t('Copiado!') : t('Copiar link')}
              </Button>
              <CustomButton
                mt="0"
                fontSize="sm"
                variant="secondary"
                label={t('Enviar pelo WhatsApp')}
                link={`https://api.whatsapp.com/send?text=${deeplink}`}
                isExternal
              />
            </HStack>
          </Box>
          <Text mt="8" fontSize="18px" fontWeight="500" lineHeight="22px" color="black">
            {t('Link com botão para pedir no Whatsapp')}
          </Text>
          <Box mt="4" position="relative" h="60px">
            <Input
              w="100%"
              h="100%"
              pr="350px"
              bg="gray.50"
              border="1px solid #C8D7CB"
              color="gray.700"
              value={`${deeplink}?mode=whatsapp`}
              onChange={() => {}}
              zIndex="100"
            />
            <HStack position="absolute" top="6px" right="2" zIndex="999">
              <Button fontSize="sm" onClick={() => copyToClipboard('whatsapp')}>
                {isCopied ? t('Copiado!') : t('Copiar link')}
              </Button>
              <CustomButton
                mt="0"
                fontSize="sm"
                variant="secondary"
                label={t('Enviar pelo WhatsApp')}
                link={`https://api.whatsapp.com/send?text=${deeplink}?mode=whatsapp`}
                isExternal
              />
            </HStack>
          </Box>
          <Text mt="8" fontSize="18px" fontWeight="500" lineHeight="22px" color="black">
            {t('Link sem botão - para uso interno na loja')}
          </Text>
          <Box mt="4" position="relative" h="60px">
            <Input
              w="100%"
              h="100%"
              pr="350px"
              bg="gray.50"
              border="1px solid #C8D7CB"
              color="gray.700"
              value={`${deeplink}?mode=in-store`}
              onChange={() => {}}
              zIndex="100"
            />
            <HStack position="absolute" top="6px" right="2" zIndex="999">
              <Button fontSize="sm" onClick={() => copyToClipboard('in-store')}>
                {isCopied ? t('Copiado!') : t('Copiar link')}
              </Button>
              <CustomButton
                mt="0"
                fontSize="sm"
                variant="secondary"
                label={t('Enviar pelo WhatsApp')}
                link={`https://api.whatsapp.com/send?text=${deeplink}?mode=in-store`}
                isExternal
              />
            </HStack>
          </Box>
        </Box>
      )}
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </Box>
  );
};

export default SharingPage;
