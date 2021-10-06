import { Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import QRCode from 'react-qr-code';
import { t } from 'utils/i18n';
import { Copied, Mode } from '.';

interface LinkBoxProps {
  title: string;
  description?: string;
  mode?: Mode;
  copied: Copied;
  link: string;
  sharingMessage: string;
  copy(): void;
}

export const LinkBox = ({
  title,
  description,
  mode,
  copied,
  link,
  sharingMessage,
  copy,
}: LinkBoxProps) => {
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
        <Text fontSize="24px" fontWeight="700" lineHeight="28.8px" color="black">
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
            {copied.status && copied.mode === mode ? t('Copiado!') : t('Copiar link')}
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
          <Button fontSize="sm" variant="outline" onClick={() => {}}>
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
        <QRCode value={link} size={210} />
      </Flex>
    </Flex>
  );
};
