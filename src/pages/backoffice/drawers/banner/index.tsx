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
import React from 'react';
import { useParams } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { InputFile } from './InputFile';
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
    updateBanner,
    updateBannerResult,
    removeBanner,
    removeBannerResult,
  } = useObserveBanner(bannerId !== 'new' ? bannerId : undefined);
  // state
  const [flavor, setFlavor] = React.useState<Flavor>('consumer');
  const [target, setTarget] = React.useState<TargetOptions>('disabled');
  const [name, setName] = React.useState('');
  const [bannerLink, setBannerLink] = React.useState('');
  const [enabled, setEnabled] = React.useState('false');
  const [bannerWebFile, setBannerWebFile] = React.useState<File | null>(null);
  const [bannerWebType, setBannerWebType] = React.useState<string>();
  const [bannerMobileFile, setBannerMobileFile] = React.useState<File | null>(
    null
  );
  const [bannerMobileType, setBannerMobileType] = React.useState<string>();
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const isNew = bannerId === 'new';
  const canUpdate = !isNew && userAbility?.can('update', 'banners');
  const updatedBy =
    banner?.updatedBy?.name ?? banner?.updatedBy?.email ?? 'N/E';
  // handlers
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
    if (!flavor || !target || (target !== 'disabled' && !bannerLink)) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'banner-valid-infos',
        message: { title: 'Informações incompletas' },
      });
    }
    if (bannerId === 'new') {
      const filesValidation = getBannerFilesValidation(
        flavor,
        bannerWebFile,
        bannerMobileFile,
        bannerWebType,
        bannerMobileType
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
      name,
      flavor,
      target,
      enabled: enabled === 'true' ? true : false,
    } as Banner;
    if (bannerLink && bannerLink.length > 0) newBanner.link = bannerLink;
    if (bannerWebType) newBanner.webImageType = bannerWebType;
    if (bannerMobileType) newBanner.mobileImageType = bannerMobileType;
    // save data
    updateBanner({
      id: bannerId,
      changes: newBanner,
      webFile: bannerWebFile,
      mobileFile: bannerMobileFile,
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
    const images = [];
    if (banner.mobileImageType)
      images.push({ size: '_320x100', type: banner.mobileImageType });
    if (banner.webImageType)
      images.push({ size: '_980x180', type: banner.webImageType });
    removeBanner({ id: banner.id, flavor: banner.flavor, images });
  };
  // side effects
  React.useEffect(() => {
    if (!banner) return;
    setName(banner.name);
    setFlavor(banner.flavor);
    setTarget(banner.target);
    setBannerLink(banner.link ?? '');
    if (banner.webImageType) setBannerWebType(banner.webImageType);
    if (banner.mobileImageType) setBannerMobileType(banner.mobileImageType);
    setEnabled(banner.enabled.toString());
  }, [banner]);
  React.useEffect(() => {
    if (target === 'disabled') setBannerLink('');
  }, [target]);
  React.useEffect(() => {
    if (flavor !== 'courier') return;
    setBannerWebFile(null);
    setBannerWebType(undefined);
  }, [flavor]);
  React.useEffect(() => {
    if (!bannerWebFile) return;
    const imageType = bannerWebFile.type.split('/')[1];
    setBannerWebType(imageType);
  }, [bannerWebFile]);
  React.useEffect(() => {
    if (!bannerMobileFile) return;
    const imageType = bannerMobileFile.type.split('/')[1];
    setBannerMobileType(imageType);
  }, [bannerMobileFile]);
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
                  <Radio value="disabled">{t('Desabilitado')}</Radio>
                  <Radio value="page">{t('Página')}</Radio>
                  <Radio value="download">{t('Download')}</Radio>
                </HStack>
              </RadioGroup>
              <SectionTitle>{t('Dados do banner')}</SectionTitle>
              <CustomInput
                id="banner-name"
                label={t('Nome *')}
                placeholder={t('Digite o nome do banner')}
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                isRequired
              />
              {target !== 'disabled' && (
                <CustomInput
                  id="banner-link"
                  label={t('Link *')}
                  placeholder={t('Cole aqui a URL do link')}
                  value={bannerLink}
                  onChange={(ev) => setBannerLink(ev.target.value)}
                  isRequired
                />
              )}
              <SectionTitle>{t('Imagens')}</SectionTitle>
              {flavor !== 'courier' && (
                <>
                  <Text mt="4" fontSize="md" color="black">
                    {t('Banner web (JPG ou GIF - 980x180)')}
                  </Text>
                  <InputFile
                    id="input-banner-web"
                    imageUrl={webImage}
                    getFile={(file) => {
                      setBannerWebFile(file);
                    }}
                  />
                </>
              )}
              <Text mt="4" fontSize="md" color="black">
                {t('Banner mobile (JPG - 320x100)')}
              </Text>
              <InputFile
                id="input-banner-mobile"
                imageUrl={mobileImage}
                getFile={(file) => {
                  setBannerMobileFile(file);
                }}
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
