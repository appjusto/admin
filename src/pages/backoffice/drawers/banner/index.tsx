import { Flavor } from '@appjusto/types';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useObserveBanner } from 'app/api/banners/useObserveBanner';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { ImageUploads } from 'common/components/ImageUploads';
import {
  bannerHeroRatios,
  bannerHeroResizedWidth,
  bannerMobileRatios,
  bannerMobileResizedWidth,
  bannerWebRatios,
  bannerWebResizedWidth,
} from 'common/imagesDimensions';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getDateAndHour, slugfyName } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { Banner, TargetOptions } from './types';
import { getBannerFilesValidation } from './utils';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  bannerId: string;
};

export const BannerDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { bannerId } = useParams<Params>();
  const { userAbility } = useContextFirebaseUser();
  const { staff } = useContextStaffProfile();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const {
    banner,
    webImage,
    mobileImage,
    heroImage,
    updateBanner,
    updateBannerResult,
    removeBanner,
    removeBannerResult,
  } = useObserveBanner(bannerId !== 'new' ? bannerId : undefined);
  // state
  const [flavor, setFlavor] = React.useState<Flavor>('consumer');
  const [target, setTarget] = React.useState<TargetOptions>('inner-page');
  const [pageTitle, setPageTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [bannerLink, setBannerLink] = React.useState('');
  const [enabled, setEnabled] = React.useState('false');
  const [bannerWebFiles, setBannerWebFiles] = React.useState<File[] | null>(
    null
  );
  const [bannerMobileFiles, setBannerMobileFiles] = React.useState<
    File[] | null
  >(null);
  const [bannerHeroFiles, setBannerHeroFiles] = React.useState<File[] | null>(
    null
  );
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const isNew = bannerId === 'new';
  const canUpdate = !isNew && userAbility?.can('update', 'banners');
  const updatedBy =
    banner?.updatedBy?.name ?? banner?.updatedBy?.email ?? 'N/E';
  // handlers
  const handlePageTitle = (value: string) => {
    setPageTitle(value);
    setSlug(slugfyName(value));
  };
  const getBannerWebFiles = React.useCallback(async (files: File[]) => {
    // setLogoExists(true);
    setBannerWebFiles(files);
  }, []);
  const getBannerMobileFiles = React.useCallback(async (files: File[]) => {
    // setLogoExists(true);
    setBannerMobileFiles(files);
  }, []);
  const getBannerHeroFiles = React.useCallback(async (files: File[]) => {
    // setLogoExists(true);
    setBannerHeroFiles(files);
  }, []);
  const clearDropImages = React.useCallback(
    (type: 'banner-web' | 'banner-mobile' | 'hero') => {
      if (type === 'banner-web') {
        // setLogoExists(false);
        setBannerWebFiles(null);
      } else if (type === 'banner-mobile') {
        // setCoverExists(false);
        setBannerMobileFiles(null);
      } else {
        // setCoverExists(false);
        setBannerHeroFiles(null);
      }
    },
    []
  );
  const handleSubmit = () => {
    // validations
    if (!staff?.id || !staff?.email) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'banner-valid-staff',
        message: {
          title: 'Não foi possível encontrar informações sobre o usuário',
        },
      });
    }
    if (!flavor || !target || !bannerLink) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'banner-valid-infos',
        message: { title: 'Informações incompletas' },
      });
    }
    if (bannerId === 'new') {
      const filesValidation = getBannerFilesValidation(
        flavor,
        target,
        bannerWebFiles,
        bannerMobileFiles,
        bannerHeroFiles
      );
      if (!filesValidation.status) {
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'banner-valid-files',
          message: { title: filesValidation.message! },
        });
      }
    }
    // create new object
    const newBanner = {
      updatedBy: {
        id: staff.id,
        email: staff.email,
        name: staff?.name ?? '',
      },
      flavor,
      target,
      pageTitle,
      slug,
      link: bannerLink,
      enabled: enabled === 'true' ? true : false,
    } as Banner;
    // save data
    console.log(newBanner);
    updateBanner({
      id: bannerId,
      changes: newBanner,
      webFiles: bannerWebFiles,
      mobileFiles: bannerMobileFiles,
      heroFiles: bannerHeroFiles,
    });
  };
  const handleRemoveBanner = () => {
    if (!banner?.id || !banner.flavor) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'banner-remove-error',
        message: { title: 'Não foi possível encontrar os dados do banner' },
      });
    }
    removeBanner({ id: banner.id, flavor: banner.flavor });
  };
  // side effects
  React.useEffect(() => {
    if (!banner) return;
    setFlavor(banner.flavor);
    setTarget(banner.target);
    if (banner.pageTitle) setPageTitle(banner.pageTitle);
    if (banner.slug) setSlug(banner.slug);
    setBannerLink(banner.link);
    setEnabled(banner.enabled.toString());
  }, [banner]);
  React.useEffect(() => {
    if (updateBannerResult.isSuccess || removeBannerResult.isSuccess) {
      onClose();
    }
  }, [onClose, updateBannerResult.isSuccess, removeBannerResult.isSuccess]);
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
          }}
        >
          <DrawerContent mt={{ base: '16', lg: '0' }}>
            <DrawerCloseButton
              bg="green.500"
              mr="12px"
              _focus={{ outline: 'none' }}
            />
            <DrawerHeader pb="2">
              <Text
                color="black"
                fontSize="2xl"
                fontWeight="700"
                lineHeight="28px"
                mb="2"
              >
                {t('Banner')}
              </Text>
              {!isNew && (
                <Box mb="6">
                  <Text
                    mt="1"
                    fontSize="15px"
                    color="black"
                    fontWeight="700"
                    lineHeight="22px"
                  >
                    {t('Criado em:')}{' '}
                    <Text as="span" fontWeight="500">
                      {getDateAndHour(banner?.createdOn)}
                    </Text>
                  </Text>
                  <Text
                    mt="1"
                    fontSize="15px"
                    color="black"
                    fontWeight="700"
                    lineHeight="22px"
                  >
                    {t('Atualizado em:')}{' '}
                    <Text as="span" fontWeight="500">
                      {getDateAndHour(banner?.updatedOn)}
                    </Text>
                  </Text>
                  <Text
                    mt="1"
                    fontSize="15px"
                    color="black"
                    fontWeight="700"
                    lineHeight="22px"
                  >
                    {t('Atualizado por:')}{' '}
                    <Text as="span" fontWeight="500">
                      {updatedBy}
                    </Text>
                  </Text>
                </Box>
              )}
            </DrawerHeader>
            <DrawerBody pb="28">
              <SectionTitle mt="0">{t('Público')}</SectionTitle>
              <RadioGroup
                mt="2"
                onChange={(value: Flavor) => setFlavor(value)}
                value={flavor}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <HStack spacing={4}>
                  <Radio value="consumer">{t('Consumidores')}</Radio>
                  <Radio value="business">{t('Restaurantes')}</Radio>
                  <Radio value="courier">{t('Entregadores')}</Radio>
                </HStack>
              </RadioGroup>
              <SectionTitle>{t('Target')}</SectionTitle>
              <RadioGroup
                mt="4"
                onChange={(value: TargetOptions) => setTarget(value)}
                value={target}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <HStack spacing={4}>
                  <Radio value="inner-page">{t('Página interna')}</Radio>
                  <Radio value="outer-page">{t('Página externa')}</Radio>
                </HStack>
              </RadioGroup>
              <SectionTitle>{t('Dados do banner')}</SectionTitle>
              <CustomInput
                id="banner-title"
                label={t(
                  `Título da página ${target === 'inner-page' ? '*' : ''}`
                )}
                placeholder={t('Juntos por um delivery mais justo')}
                value={pageTitle}
                onChange={(ev) => handlePageTitle(ev.target.value)}
                isRequired={target === 'inner-page'}
              />
              <Text mt="2" color="gray.600" fontSize="13px">
                {t(`Slug: ${slug}`)}
              </Text>
              <CustomInput
                id="banner-link"
                label={t('Link *')}
                placeholder={t('Cole aqui a URL do link')}
                value={bannerLink}
                onChange={(ev) => setBannerLink(ev.target.value)}
                isRequired
              />
              <SectionTitle>{t('Imagens')}</SectionTitle>
              <Text mt="4" fontSize="md" color="black">
                {t('Banner web (PNG - 980x180)')}
              </Text>
              <ImageUploads
                key="banner-web-image"
                mt="4"
                width={600}
                height={110}
                imageUrl={webImage ?? null}
                ratios={bannerWebRatios}
                resizedWidth={bannerWebResizedWidth}
                placeholderText={t('PNG 980x180')}
                getImages={getBannerWebFiles}
                clearDrop={() => clearDropImages('banner-web')}
                imageType="image/png"
              />
              <Text mt="4" fontSize="md" color="black">
                {t('Banner mobile (PNG - 320x100)')}
              </Text>
              <ImageUploads
                key="banner-mob-image"
                mt="4"
                width={600}
                height={187.5}
                imageUrl={mobileImage ?? null}
                ratios={bannerMobileRatios}
                resizedWidth={bannerMobileResizedWidth}
                placeholderText={t('PNG - 320x100')}
                getImages={getBannerMobileFiles}
                clearDrop={() => clearDropImages('banner-mobile')}
                imageType="image/png"
              />
              <Text mt="4" fontSize="md" color="black">
                {t('Banner hero (PNG - 980x980)')}
              </Text>
              <ImageUploads
                key="banner-hero-image"
                mt="4"
                width={400}
                height={400}
                imageUrl={heroImage ?? null}
                ratios={bannerHeroRatios}
                resizedWidth={bannerHeroResizedWidth}
                placeholderText={t('PNG - 980x980')}
                getImages={getBannerHeroFiles}
                clearDrop={() => clearDropImages('hero')}
                imageType="image/png"
              />
              {canUpdate && (
                <>
                  <SectionTitle>{t('Status')}</SectionTitle>
                  <RadioGroup
                    mt="2"
                    onChange={(value) => setEnabled(value)}
                    value={enabled}
                    defaultValue="1"
                    colorScheme="green"
                    color="black"
                    fontSize="15px"
                    lineHeight="21px"
                  >
                    <VStack mt="4" spacing={2} alignItems="flex-start">
                      <Radio value="true">{t('Ativo')}</Radio>
                      <Radio value="false">{t('Desativado')}</Radio>
                    </VStack>
                  </RadioGroup>
                </>
              )}
            </DrawerBody>
            {isNew && (
              <DrawerFooter borderTop="1px solid #F2F6EA">
                <HStack w="100%" spacing={4}>
                  <Button
                    width="full"
                    fontSize="15px"
                    type="submit"
                    isLoading={updateBannerResult.isLoading}
                    loadingText={t('Salvando')}
                  >
                    {t('Salvar')}
                  </Button>
                  <Button
                    width="full"
                    fontSize="15px"
                    variant="dangerLight"
                    onClick={onClose}
                  >
                    {t('Cancelar')}
                  </Button>
                </HStack>
              </DrawerFooter>
            )}
            {canUpdate && (
              <DrawerFooter borderTop="1px solid #F2F6EA">
                {isDeleting ? (
                  <Box
                    mt="8"
                    w="100%"
                    bg="#FFF8F8"
                    border="1px solid red"
                    borderRadius="lg"
                    p="6"
                  >
                    <Text color="red">
                      {t(`Tem certeza que deseja excluir este banner?`)}
                    </Text>
                    <HStack mt="4" spacing={4}>
                      <Button
                        width="full"
                        fontSize="15px"
                        onClick={() => setIsDeleting(false)}
                      >
                        {t(`Manter banner`)}
                      </Button>
                      <Button
                        width="full"
                        variant="danger"
                        fontSize="15px"
                        onClick={handleRemoveBanner}
                        isLoading={removeBannerResult.isLoading}
                      >
                        {t(`Excluir`)}
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <HStack w="100%" spacing={4}>
                    <Button
                      width="full"
                      fontSize="15px"
                      type="submit"
                      isLoading={updateBannerResult.isLoading}
                      loadingText={t('Salvando')}
                    >
                      {t('Salvar alterações')}
                    </Button>
                    <Button
                      width="full"
                      fontSize="15px"
                      variant="dangerLight"
                      onClick={() => setIsDeleting(true)}
                    >
                      {t('Excluir banner')}
                    </Button>
                  </HStack>
                )}
              </DrawerFooter>
            )}
          </DrawerContent>
        </form>
      </DrawerOverlay>
    </Drawer>
  );
};
