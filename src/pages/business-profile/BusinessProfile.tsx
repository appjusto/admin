import { Box, Text, useBreakpoint } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { CustomPatternInput as PatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { cnpjFormatter, cnpjMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { ImageUploads } from 'common/components/ImageUploads';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import { CuisineSelect } from '../../common/components/form/select/CuisineSelect';

const BusinessProfile = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const business = useContextBusiness();

  // state
  const [name, setName] = React.useState(business?.name ?? '');
  const [cnpj, setCNPJ] = React.useState(business?.cnpj ?? '');
  const [cuisineId, setCuisineId] = React.useState(business?.cuisine?.id ?? '');
  const [description, setDescription] = React.useState(business?.description ?? '');
  const [minimumOrder, setMinimumOrder] = React.useState(business?.minimumOrder ?? 0);
  const [logoPreviewURL, setLogoPreviewURL] = React.useState<string | null>(null);
  const [coverPreviewURL, setCoverPreviewURL] = React.useState<string | null>(null);
  const [logoFile, setLogoFile] = React.useState<File[] | null>(null);
  const [coverFile, setCoverFile] = React.useState<File[] | null>(null);
  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const hasLogoImage = React.useRef(false);
  const hasCoverImage = React.useRef(false);
  // queries & mutations
  const {
    updateBusinessProfile,
    logo,
    cover,
    uploadLogo,
    uploadCover,
    result,
  } = useBusinessProfile();
  const { isLoading, isSuccess } = result;
  // handlers
  const onSubmitHandler = async () => {
    await updateBusinessProfile({
      name,
      cnpj,
      description,
      minimumOrder,
      cuisine: {
        id: cuisineId,
        name: '',
        imagePath: '',
      },
    });
  };
  const onDropLogoHandler = async (acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    const url = URL.createObjectURL(file);
    //uploadLogo(file);
    setLogoPreviewURL(url);
  };

  const onDropCoverHandler = async (acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    const url = URL.createObjectURL(file);
    //uploadCover(file);
    setCoverPreviewURL(url);
  };

  const clearDropImages = (type: string) => {
    if (type === 'logo') {
      hasLogoImage.current = false;
      setLogoPreviewURL(null);
    } else {
      hasCoverImage.current = false;
      setCoverPreviewURL(null);
    }
  };

  const handleLogoCrop = async (files: File[]) => {
    setLogoFile(files);
  };

  const handleCoverCrop = async (files: File[]) => {
    setCoverFile(files);
  };

  // side effects
  React.useEffect(() => {
    nameRef?.current?.focus();
  }, []);
  React.useEffect(() => {
    if (business) {
      if (business.name) setName(business.name);
      if (business.cnpj) setCNPJ(business.cnpj);
      if (business.description) setDescription(business.description);
      if (business.minimumOrder) setMinimumOrder(business.minimumOrder);
      if (business.cuisine?.id) setCuisineId(business.cuisine.id);
    }
    if (business?.logoExists) {
      hasLogoImage.current = true;
    }
    if (business?.coverImageExists) {
      hasCoverImage.current = true;
    }
  }, [business]);

  // UI
  const breakpoint = useBreakpoint();
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box maxW="464px">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        <PageHeader
          title={t('Sobre o restaurante')}
          subtitle={t('Essas informações serão vistas por seus visitantes')}
        />
        <Input
          isRequired
          id="business-name"
          ref={nameRef}
          label={t('Nome')}
          placeholder={t('Nome')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <PatternInput
          isRequired
          id="business-cnpj"
          label={t('CNPJ')}
          placeholder={t('CNPJ do seu estabelecimento')}
          mask={cnpjMask}
          parser={numbersOnlyParser}
          formatter={cnpjFormatter}
          value={cnpj}
          onValueChange={(value) => setCNPJ(value)}
          validationLength={14}
        />
        <CuisineSelect
          isRequired
          value={cuisineId}
          onChange={(ev) => setCuisineId(ev.target.value)}
        />
        <Textarea
          isRequired
          id="business-description"
          label={t('Descrição')}
          placeholder={t('Descreva seu restaurante')}
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <CurrencyInput
          isRequired
          id="business-min-price"
          label={t('Valor mínimo do pedido')}
          placeholder={t('R$ 0,00')}
          value={minimumOrder}
          onChangeValue={(value) => setMinimumOrder(value)}
          maxLength={8}
        />
        {/* logo */}
        <Text mt="8" fontSize="xl" color="black">
          {t('Logo do estabelecimento')}
        </Text>
        <Text mt="2" fontSize="md">
          {t(
            'Para o logo do estabelecimento recomendamos imagens no formato quadrado (1:1) com no mínimo 200px de largura'
          )}
        </Text>
        <ImageUploads
          mt="4"
          width={200}
          height={200}
          onDropFile={onDropLogoHandler}
          preview={logoPreviewURL}
          ratios={[1 / 1]}
          hasImage={hasLogoImage.current}
          onCropEnd={handleLogoCrop}
          clearDrop={() => clearDropImages('logo')}
        />
        {/* cover image */}
        <Text mt="8" fontSize="xl" color="black">
          {t('Imagem de capa')}
        </Text>
        <Text mt="2" fontSize="md">
          {t(
            'Você pode ter também uma imagem de capa para o seu restaurante. Pode ser foto do local ou de algum prato específico. Recomendamos imagens na proporção retangular (16:9) com no mínimo 1280px de largura'
          )}
        </Text>
        <ImageUploads
          mt="4"
          width={breakpoint === 'base' ? 328 : breakpoint === 'md' ? 420 : 464}
          height={breakpoint === 'base' ? 180 : breakpoint === 'md' ? 235 : 260}
          onDropFile={onDropCoverHandler}
          preview={coverPreviewURL}
          ratios={[7 / 5]}
          hasImage={hasCoverImage.current}
          onCropEnd={handleCoverCrop}
          clearDrop={() => clearDropImages('cover')}
        />
        {/* submit */}
        <PageFooter
          onboarding={onboarding}
          redirect={redirect}
          isLoading={isLoading}
          onSubmit={onSubmitHandler}
        />
      </form>
    </Box>
  );
};

export default BusinessProfile;
