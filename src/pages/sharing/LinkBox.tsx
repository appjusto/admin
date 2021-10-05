import { Box, Button, HStack, Input, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { t } from 'utils/i18n';
import { Copied, Mode } from '.';

interface LinkBoxProps {
  title: string;
  mode?: Mode;
  copied: Copied;
  getLink(): string;
  copy(): void;
  getSharingMessage(): string;
}

export const LinkBox = ({
  title,
  mode,
  copied,
  getLink,
  copy,
  getSharingMessage,
}: LinkBoxProps) => {
  return (
    <Box>
      <Text mt="8" fontSize="18px" fontWeight="500" lineHeight="22px" color="black">
        {title}
      </Text>
      <Box mt="4" position="relative" h="60px">
        <Input
          w="100%"
          h="100%"
          pr="350px"
          bg="gray.50"
          border="1px solid #C8D7CB"
          color="gray.700"
          value={getLink()}
          onChange={() => {}}
          zIndex="100"
        />
        <HStack position="absolute" top="6px" right="2" zIndex="999">
          <Button fontSize="sm" onClick={() => copy()}>
            {copied.status && copied.mode === mode ? t('Copiado!') : t('Copiar link')}
          </Button>
          <CustomButton
            mt="0"
            fontSize="sm"
            variant="secondary"
            label={t('Enviar pelo WhatsApp')}
            link={`https://api.whatsapp.com/send?text=${getSharingMessage()}`}
            isExternal
          />
        </HStack>
      </Box>
    </Box>
  );
};
