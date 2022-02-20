import { Box, Button, CenterProps, HStack, Image } from '@chakra-ui/react';
import { useContextCourierProfile } from 'app/state/courier/context';
import { CloseButton } from 'common/components/buttons/CloseButton';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { ImageFbLoading } from 'common/components/ImageFbLoading';
import { ImageUploads } from 'common/components/ImageUploads';
import {
  courierDocRatios,
  courierDocResizedWidth,
  courierSelfieRatios,
  courierSelfieResizedWidth,
} from 'common/imagesDimensions';
import { ReactComponent as DropImage } from 'common/img/drop-image.svg';
import React from 'react';
import { t } from 'utils/i18n';

interface ImagePreviewProps extends CenterProps {
  src?: string | null;
  onClose(): void;
}

const ImagePreview = ({ src, onClose, ...props }: ImagePreviewProps) => {
  return (
    <Box
      mt="4"
      position="relative"
      w="100%"
      p="4"
      border="1px solid #C8D7CB"
      borderRadius="lg"
      {...props}
    >
      {src ? (
        <Image src={src} w="100%" fallback={<ImageFbLoading w="100%" h="100%" />} zIndex="100" />
      ) : (
        <DropImage />
      )}
      <CloseButton
        position="absolute"
        top="2"
        right="2"
        color="red"
        onClick={onClose}
        zIndex="999"
      />
    </Box>
  );
};

export const Documents = () => {
  // context
  const {
    courier,
    pictures,
    setSelfieFiles,
    setDocumentFiles,
    handleProfileChange,
  } = useContextCourierProfile();
  // state
  const [preview, setPreview] = React.useState<string | null>(null);
  // handlers
  const getSelfieFiles = React.useCallback(
    async (files: File[]) => {
      setSelfieFiles(files);
    },
    [setSelfieFiles]
  );
  const getDocumentFiles = React.useCallback(
    async (files: File[]) => {
      setDocumentFiles(files);
    },
    [setDocumentFiles]
  );
  const clearDropImages = React.useCallback(
    (type: string) => {
      if (type === 'selfie') setSelfieFiles(null);
      else setDocumentFiles(null);
    },
    [setSelfieFiles, setDocumentFiles]
  );
  // UI
  return (
    <Box mt="4">
      <HStack spacing={{ base: 2, md: 4 }}>
        <Box textAlign="center">
          <ImageUploads
            key={pictures?.selfie ?? 'selfie'}
            width={162}
            height={162}
            imageUrl={pictures?.selfie}
            ratios={courierSelfieRatios}
            resizedWidth={courierSelfieResizedWidth}
            placeholderText={t('Selfie')}
            getImages={getSelfieFiles}
            clearDrop={() => clearDropImages('selfie')}
            doubleSizeCropping
          />
          <Button mt="4" size="sm" variant="outline" onClick={() => setPreview('selfie')}>
            {t('Ampliar selfie')}
          </Button>
        </Box>
        <Box textAlign="center">
          <ImageUploads
            key={pictures?.document ?? 'document'}
            width={162}
            height={162}
            imageUrl={pictures?.document}
            ratios={courierDocRatios}
            resizedWidth={courierDocResizedWidth}
            placeholderText={t('Documento')}
            getImages={getDocumentFiles}
            clearDrop={() => clearDropImages('document')}
            doubleSizeCropping
          />
          <Button mt="4" size="sm" variant="outline" onClick={() => setPreview('document')}>
            {t('Ampliar documento')}
          </Button>
        </Box>
      </HStack>
      {preview &&
        (preview === 'selfie' ? (
          <ImagePreview src={pictures?.selfie} onClose={() => setPreview(null)} />
        ) : (
          <ImagePreview src={pictures?.document} onClose={() => setPreview(null)} />
        ))}
      <Input
        id="document-number"
        label={t('Número do documento')}
        placeholder={t('00000000')}
        value={courier?.documentNumber ?? ''}
        onChange={(ev) => handleProfileChange('documentNumber', ev.target.value)}
      />
      <Input
        id="document-date"
        type="date"
        label={t('Validade do documento')}
        placeholder={t('00000000')}
        value={courier?.documentValidity ?? ''}
        onChange={(ev) => handleProfileChange('documentValidity', ev.target.value)}
      />
    </Box>
  );
};
