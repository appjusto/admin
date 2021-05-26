import { Box, Center, CenterProps, HStack, Image } from '@chakra-ui/react';
import { useContextCourierProfile } from 'app/state/courier/context';
import { CloseButton } from 'common/components/buttons/CloseButton';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { ImageFbLoading } from 'common/components/ImageFbLoading';
import { ReactComponent as DropImage } from 'common/img/drop-image.svg';
import React from 'react';
import { t } from 'utils/i18n';

interface ImageCircleProps extends CenterProps {
  src?: string | null;
}

const ImageCircle = ({ src, ...props }: ImageCircleProps) => {
  return (
    <Center
      bg="gray.400"
      w="161px"
      h="161px"
      borderRadius="80.5px"
      overflow="hidden"
      cursor="pointer"
      {...props}
    >
      {src ? (
        <Image src={src} objectFit="cover" fallback={<ImageFbLoading w="161px" h="161px" />} />
      ) : (
        <DropImage />
      )}
    </Center>
  );
};

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
  const { courier, pictures, handleProfileChange } = useContextCourierProfile();
  // state
  const [preview, setPreview] = React.useState<string | null>(null);
  // UI
  return (
    <Box mt="4">
      <HStack spacing={4}>
        <ImageCircle src={pictures?.selfie} onClick={() => setPreview('selfie')} />
        <ImageCircle src={pictures?.document} onClick={() => setPreview('document')} />
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
