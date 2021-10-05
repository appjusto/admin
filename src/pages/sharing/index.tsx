import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { slugify } from 'utils/formatters';
import { t } from 'utils/i18n';
import { LinkBox } from './LinkBox';

export type Mode = 'whatsapp' | 'in-store';

export type Copied = {
  status: boolean;
  mode?: Mode;
};

type SharingLink = {
  key: string;
  title: string;
  mode?: Mode;
};

const linksArr = [
  { key: '1', title: 'Link com botão para pedir no AppJusto' },
  { key: '2', title: 'Link com botão para pedir no Whatsapp', mode: 'whatsapp' },
  { key: '3', title: 'Link sem botão (para uso interno na loja)', mode: 'in-store' },
] as SharingLink[];

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
      {business?.slug &&
        linksArr.map((link) => (
          <LinkBox
            key={link.key}
            title={link.title}
            mode={link.mode}
            copied={isCopied}
            getLink={() => getBusinessLinkByMode(link.mode)}
            getSharingMessage={() => getWhatsappSharingMessage(link.mode)}
            copy={() => copyToClipboard(link.mode)}
          />
        ))}
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
