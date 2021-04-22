import { Box, Center, CenterProps, HStack, Image } from '@chakra-ui/react';
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

interface DocumentsProps {
  pictures: { selfie: string | null; document: string | null };
}

export const Documents = ({ pictures }: DocumentsProps) => {
  // context

  // state
  const [number, setNumber] = React.useState('');
  const [date, setDate] = React.useState('');
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
        value={number}
        onChange={(ev) => setNumber(ev.target.value)}
      />
      <Input
        id="document-date"
        type="date"
        label={t('Validade do documento')}
        placeholder={t('00000000')}
        value={date}
        onChange={(ev) => setDate(ev.target.value)}
      />
    </Box>
  );
};
