import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTrackEvent } from 'app/api/measurement/useTrackEvent';
import { CustomButton } from 'common/components/buttons/CustomButton';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import QRCode from 'react-qr-code';
import { t } from 'utils/i18n';
import { Copied, Mode } from '.';

interface LinkBoxProps {
  id: string;
  title: string;
  description?: string;
  mode?: Mode;
  copied: Copied;
  getLink(mode: Mode): string;
  getSharingMessage(mode: Mode): string;
  copy(mode?: Mode): void;
}

type SelectedMode = 'whatsapp' | 'none';

export const LinkBoxWithOption = ({
  id,
  title,
  description,
  mode,
  copied,
  getLink,
  getSharingMessage,
  copy,
}: LinkBoxProps) => {
  // state
  const { trackEvent } = useTrackEvent();
  const [selectedMode, setSelectedMode] = React.useState<SelectedMode>('none');
  // helpers
  const ModeStatus = (
    selectedMode === 'whatsapp' ? selectedMode : undefined
  ) as Mode;
  const internalLink = getLink(ModeStatus);
  const internalSharingMessage = getSharingMessage(ModeStatus);
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
        <RadioGroup
          onChange={(value) => setSelectedMode(value as SelectedMode)}
          value={selectedMode}
          defaultValue="1"
          colorScheme="green"
          color="black"
          fontSize="15px"
          lineHeight="21px"
        >
          <HStack mt="6" spacing={4} alignItems="flex-start">
            <CustomRadio value="none" />
            <Box>
              <Text
                color="black"
                fontSize="16px"
                lineHeight="22px"
                fontWeight="500"
              >
                {t('Botão para AppJusto')}
              </Text>
              <Text
                fontSize="15px"
                lineHeight="21px"
                fontWeight="500"
                color="#697667"
              >
                {t(
                  'Cliente é levado a acessar a página do restaurante no app ou baixar o AppJusto'
                )}
              </Text>
            </Box>
          </HStack>
          <HStack mt="6" spacing={4} alignItems="flex-start">
            <CustomRadio value="whatsapp" />
            <Box>
              <Text
                color="black"
                fontSize="16px"
                lineHeight="22px"
                fontWeight="500"
              >
                {t('Botão para WhatsApp')}
              </Text>
              <Text
                fontSize="15px"
                lineHeight="21px"
                fontWeight="500"
                color="#697667"
              >
                {t(
                  'Cliente é levado a enviar uma mensagem no WhatsApp com seu pedido'
                )}
              </Text>
            </Box>
          </HStack>
        </RadioGroup>
        <Input
          mt="6"
          w="100%"
          h="60px"
          bg="gray.50"
          border="1px solid #C8D7CB"
          color="gray.700"
          value={internalLink}
          onChange={() => {}}
          overflow="scroll"
        />
        <Stack mt="6" spacing={4} direction={{ base: 'column', md: 'row' }}>
          <Button fontSize="sm" onClick={() => copy(ModeStatus)}>
            {copied.status && copied.mode === ModeStatus
              ? t('Copiado!')
              : t('Copiar link')}
          </Button>
          <CustomButton
            mt="0"
            w={{ base: '100%', lg: 'auto' }}
            fontSize="sm"
            variant="secondary"
            label={t('Enviar pelo WhatsApp')}
            link={`https://api.whatsapp.com/send?text=${internalSharingMessage}`}
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
        <QRCode id={id} value={internalLink} size={210} />
      </Flex>
    </Flex>
  );
};
