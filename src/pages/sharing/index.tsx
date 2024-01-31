import { EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { slugify } from 'utils/formatters';
import { t } from 'utils/i18n';
import { LinkBox } from './LinkBox';

export type Copied = {
  status: boolean;
};

const SharingPage = () => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { updateBusinessSlug, updateSlugResult } = useBusinessProfile(
    business?.id
  );
  const { isLoading } = updateSlugResult;
  // state
  const [slug, setSlug] = React.useState('');
  const [isEdditing, setIsEdditing] = React.useState(false);
  const [deeplink, setDeeplink] = React.useState('');
  const [isCopied, setIsCopied] = React.useState<Copied>({ status: false });
  // handlers
  const copyToClipboard = () => {
    const copied = { status: true };
    setIsCopied(copied);
    setTimeout(() => setIsCopied({ status: false }), 2000);
    return navigator.clipboard.writeText(deeplink);
  };
  const getWhatsappSharingMessage = () => {
    return encodeURIComponent(
      `Olá, queria indicar o ${business?.name}! No appjusto, os preços dos pratos são menores, e você valoriza mais ainda o restaurante e o entregador. Um delivery mais justo de verdade ;)\n\n${deeplink}`
    );
  };
  const handleUpdate = () => {
    if (!business?.id || !slug) return;
    updateBusinessSlug({ businessId: business.id, slug });
  };
  // side effects
  React.useEffect(() => {
    if (!business?.slug) {
      if (business?.name) setSlug(slugify(business?.name));
      setIsEdditing(true);
    } else {
      const deeplink =
        process.env.REACT_APP_ENVIRONMENT === 'live'
          ? `https://appjusto.com.br/r/${business.slug}`
          : `https://${process.env.REACT_APP_ENVIRONMENT}.appjusto.com.br/r/${business.slug}`;
      setSlug(business.slug);
      setDeeplink(deeplink);
    }
  }, [business?.slug, business?.name]);
  // UI
  return (
    <Box>
      <PageHeader
        title={t('Compartilhamento')}
        subtitle={t('Crie e gerencie o link do seu restaurante.')}
      />
      {business?.slug && (
        <LinkBox
          id="QRCode"
          title="Cardápio digital"
          description="Link para a página do seu restaurante no appjusto"
          copied={isCopied}
          link={deeplink}
          sharingMessage={getWhatsappSharingMessage()}
          copy={copyToClipboard}
        />
      )}
      {isEdditing ? (
        <Box pb="4" borderBottom="1px solid #EEEEEE">
          <SectionTitle mt="8">
            {t('Configure seu link de compartilhamento')}
          </SectionTitle>
          {business?.slug ? (
            <Text mt="4">
              {t(
                'Edite o identificador do link de acesso direto ao seu restaurante.'
              )}
            </Text>
          ) : (
            <Text mt="4">
              {t(
                'Você pode compartilhar o link de acesso direto ao seu restaurante no appjusto. Crie um identificador, com a sugestão abaixo ou digitando à sua escolha e clicando em salvar, depois copie o link gerado e divulgue nas suas redes!'
              )}
            </Text>
          )}
          <Stack
            display={
              userAbility?.can('update', 'businesses', 'slug') ? 'flex' : 'none'
            }
            mt="4"
            spacing={2}
            direction={{ base: 'column', md: 'row' }}
          >
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
            <Button
              h="60px"
              minW="120px"
              onClick={handleUpdate}
              isLoading={isLoading}
            >
              {business?.slug ? t('Salvar') : t('Salvar e gerar links')}
            </Button>
            {business?.slug !== undefined ? (
              <Button
                h="60px"
                minW="120px"
                variant="outline"
                onClick={() => setIsEdditing(false)}
              >
                {t('Cancelar')}
              </Button>
            ) : null}
          </Stack>
        </Box>
      ) : (
        <Flex
          // justifyContent="end"
          mt="4"
          py="2"
          borderBottom="1px solid #EEEEEE"
        >
          <HStack
            spacing={2}
            alignItems="center"
            color="green.600"
            cursor="pointer"
            onClick={() => setIsEdditing(true)}
          >
            <Text>Editar link</Text>
            <EditIcon />
          </HStack>
        </Flex>
      )}
    </Box>
  );
};

export default SharingPage;
