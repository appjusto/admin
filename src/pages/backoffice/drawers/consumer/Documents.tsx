import { Box, Button, CenterProps, HStack, Image } from '@chakra-ui/react';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { CloseButton } from 'common/components/buttons/CloseButton';
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
import { SectionTitle } from '../generics/SectionTitle';

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
  const { pictures, setSelfieFiles, setDocumentFiles } = useContextConsumerProfile();
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
    <Box>
      <SectionTitle>{t('Fotos')}</SectionTitle>
      <HStack mt="6" spacing={{ base: 2, md: 4 }}>
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
    </Box>
  );
};
