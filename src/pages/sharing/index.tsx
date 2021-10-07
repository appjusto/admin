import { Box, Button, Center, Icon, Stack, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { slugify } from 'utils/formatters';
import { t } from 'utils/i18n';
import { LinkBox } from './LinkBox';
import { LinkBoxWithOption } from './LinkBoxWithOption';

export type Mode = 'whatsapp' | 'in-store';

export type Copied = {
  status: boolean;
  mode?: Mode;
};

const SharingPage = () => {
  // context
  const { business } = useContextBusiness();
  const { updateBusinessSlug, updateSlugResult } = useBusinessProfile();
  const { isLoading, isSuccess, isError, error: updateError } = updateSlugResult;
  // state
  const [slug, setSlug] = React.useState('');
  const [deeplink, setDeeplink] = React.useState('');
  const [isCopied, setIsCopied] = React.useState<Copied>({ status: false });
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
  // handlers
  const getBusinessLinkByMode = (mode?: Mode) => `${deeplink}${mode ? `?mode=${mode}` : ''}`;
  const copyToClipboard = (mode?: 'whatsapp' | 'in-store') => {
    const copied = { status: true, mode };
    setIsCopied(copied);
    setTimeout(() => setIsCopied({ status: false }), 2000);
    return navigator.clipboard.writeText(getBusinessLinkByMode(mode));
  };
  const getWhatsappSharingMessage = (mode?: Mode) => {
    return encodeURIComponent(
      `Olá, queria indicar o ${
        business?.name
      }! No AppJusto, os preços dos pratos são menores, e você valoriza mais ainda o restaurante e o entregador. Um delivery mais justo de verdade ;)\n\n${getBusinessLinkByMode(
        mode
      )}`
    );
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
      <SectionTitle mt="8">{t('Configure o nome do seu link de compartilhamento')}</SectionTitle>
      <Text mt="4">
        {t(
          'Você pode compartilhar o acesso direto ao seu restaurante no AppJusto. Crie um identificador, com a sugestão abaixo ou digitando à sua escolha e clicando em salvar, depois copie o link gerado e divulgue nas suas redes!'
        )}
      </Text>
      <Stack mt="4" spacing={2} direction={{ base: 'column', md: 'row' }}>
        <CustomInput
          mt="0"
          maxW="320px"
          id="custom-slug"
          label={t('Identificador do restaurante')}
          placeholder={t('Digite um identificador')}
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          onBlur={(e) => setSlug(slugify(e.target.value, true))}
          //isDisabled={deeplink !== undefined}
        />
        <Button
          h="60px"
          minW="120px"
          onClick={handleUpdate}
          isLoading={isLoading}
          //isDisabled={deeplink !== undefined}
        >
          {t('Salvar')}
        </Button>
      </Stack>
      {business?.slug && (
        <>
          <Stack
            mt="8"
            direction="row"
            spacing={4}
            alignItems="center"
            p="6"
            bgColor="#F6F6F6"
            borderRadius="lg"
            color="black"
          >
            <Center p="2" bgColor="#fff" borderRadius="18px">
              <Icon as={MdInfoOutline} w="24px" h="24px" />
            </Center>
            <Text maxW="847px" fontSize="16px" lineHeight="22px" fontWeight="500">
              {t(
                'Caso o cliente tenha o aplicativo do AppJusto instalado, poderá abrir os links abaixo diretamente no app ou no navegador padrão. Se abrir pelo navegador, ele verá o cardápio digital com a opção do link selecionado.'
              )}
            </Text>
          </Stack>
          <LinkBoxWithOption
            id="QRCode1"
            title="Cardápio com botão: fazer pedidos"
            description="Ao clicar, seu cliente abrirá o cardápio com um botão de ação. Escolha a ação abaixo:"
            mode="whatsapp"
            copied={isCopied}
            copy={(mode) => copyToClipboard(mode)}
            getLink={(mode) => getBusinessLinkByMode(mode)}
            getSharingMessage={(mode) => getWhatsappSharingMessage(mode)}
          />
          <LinkBox
            id="QRCode2"
            title="Cardápio sem botão: somente visualização"
            description="Ao clicar, seu cliente abrirá a página do cardápio para visualização na loja, sem a opção de pedir"
            mode="in-store"
            copied={isCopied}
            link={getBusinessLinkByMode('in-store')}
            sharingMessage={getWhatsappSharingMessage('in-store')}
            copy={() => copyToClipboard('in-store')}
          />
        </>
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
