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
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
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
  const { dispatchAppRequestResult } = useContextAppRequests();
  // state
  const [flavor, setFlavor] = React.useState<Flavor>('consumer');
  const [target, setTarget] = React.useState<TargetOptions>('inner-page');
  const [pageTitle, setPageTitle] = React.useState('');
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
  // handlers
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
    if (!flavor || !target || !bannerLink) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'banner-valid-infos',
        message: { title: 'Informações incompletas' },
      });
    }
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
    // create new object
    const newBanner = {
      flavor,
      target,
      pageTitle,
      link: bannerLink,
      enabled: Boolean(enabled),
    } as Banner;
    // save data
    console.log(newBanner);
  };
  // side effects

  // React.useEffect(() => {
  //   if (
  //     submitPushCampaignResult.isSuccess ||
  //     deletePushCampaignResult.isSuccess
  //   ) {
  //     onClose();
  //   }
  // }, [
  //   onClose,
  //   submitPushCampaignResult.isSuccess,
  //   deletePushCampaignResult.isSuccess,
  // ]);
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
                onChange={(ev) => setPageTitle(ev.target.value)}
                isRequired={target === 'inner-page'}
              />
              <Text mt="2" color="gray.600" fontSize="13px">
                {t('Slug: juntos-por-um-delivery-mais-justo')}
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
                imageUrl={null}
                ratios={bannerWebRatios}
                resizedWidth={bannerWebResizedWidth}
                placeholderText={t('PNG 980x180')}
                getImages={getBannerWebFiles}
                clearDrop={() => clearDropImages('banner-web')}
                doubleSizeCropping={false}
              />
              <Text mt="4" fontSize="md" color="black">
                {t('Banner mobile (PNG - 320x100)')}
              </Text>
              <ImageUploads
                key="banner-mob-image"
                mt="4"
                width={600}
                height={187.5}
                imageUrl={null}
                ratios={bannerMobileRatios}
                resizedWidth={bannerMobileResizedWidth}
                placeholderText={t('PNG - 320x100')}
                getImages={getBannerMobileFiles}
                clearDrop={() => clearDropImages('banner-mobile')}
                doubleSizeCropping={false}
              />
              <Text mt="4" fontSize="md" color="black">
                {t('Banner hero (PNG - 980x980)')}
              </Text>
              <ImageUploads
                key="banner-hero-image"
                mt="4"
                width={400}
                height={400}
                imageUrl={null}
                ratios={bannerHeroRatios}
                resizedWidth={bannerHeroResizedWidth}
                placeholderText={t('PNG - 980x980')}
                getImages={getBannerHeroFiles}
                clearDrop={() => clearDropImages('hero')}
                doubleSizeCropping={false}
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
                    // isLoading={isLoading}
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
                        // onClick={() => deletePushCampaign(campaignId)}
                        // isLoading={deletePushCampaignResult.isLoading}
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
                      // isLoading={isLoading}
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
