import { Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { useTrackEvent } from 'app/api/measurement/useTrackEvent';
import { CustomButton } from 'common/components/buttons/CustomButton';
import QRCode from 'react-qr-code';
import { t } from 'utils/i18n';
import { Copied, Mode } from '.';

interface LinkBoxProps {
  id: string;
  title: string;
  description?: string;
  mode?: Mode;
  copied: Copied;
  link: string;
  sharingMessage: string;
  copy(): void;
}

export const LinkBox = ({
  id,
  title,
  description,
  mode,
  copied,
  link,
  sharingMessage,
  copy,
}: LinkBoxProps) => {
  // context
  const { trackEvent } = useTrackEvent();
  // handlers
  const downloadQRCode = () => {
    trackEvent({ eventName: 'share', params: { method: 'qr_code' } });
    try {
      const svg = document.getElementById(id);
      const svgData = new XMLSerializer().serializeToString(svg!);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = id;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    } catch (error) {
      console.error(error);
    }
  };
  // UI
  return (
    <Flex
      mt="8"
      w="100%"
      p="6"
      flexDir={{ base: 'column', lg: 'row' }}
      border="1px solid #F6F6F6"
      borderRadius="lg"
    >
      <Box w="100%">
        <Text
          fontSize="24px"
          fontWeight="700"
          lineHeight="28.8px"
          color="black"
        >
          {title}
        </Text>
        <Text mt="1" fontSize="15px" fontWeight="500" lineHeight="21px">
          {description}
        </Text>
        <Input
          mt="6"
          w="100%"
          h="60px"
          bg="gray.50"
          border="1px solid #C8D7CB"
          color="gray.700"
          value={link}
          onChange={() => {}}
          overflow="scroll"
        />
        <Stack mt="6" spacing={4} direction={{ base: 'column', md: 'row' }}>
          <Button fontSize="sm" onClick={() => copy()}>
            {copied.status && copied.mode === mode
              ? t('Copiado!')
              : t('Copiar link')}
          </Button>
          <CustomButton
            mt="0"
            w={{ base: '100%', lg: 'auto' }}
            fontSize="sm"
            variant="secondary"
            label={t('Enviar pelo WhatsApp')}
            link={`https://api.whatsapp.com/send?text=${sharingMessage}`}
            isExternal
          />
          <Button
            fontSize="sm"
            variant="outline"
            color="black"
            onClick={downloadQRCode}
          >
            {t('Salvar QR Code')}
          </Button>
        </Stack>
      </Box>
      <Flex
        ml={{ base: '0', lg: '6' }}
        mt={{ base: '4', lg: '0' }}
        w={{ base: '100%', lg: '210px' }}
        justifyContent="center"
      >
        <QRCode id={id} value={link} size={210} />
      </Flex>
    </Flex>
  );
};
