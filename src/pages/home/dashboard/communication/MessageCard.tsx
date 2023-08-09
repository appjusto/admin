import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import { useClipboard } from 'app/api/business/useClipboard';
import React from 'react';
import { MdOutlineFileCopy } from 'react-icons/md';
import { t } from 'utils/i18n';

interface MessageCardProps {
  title: string;
  body: string;
  notifySelected(msg: string): void;
}

const mainUrl = 'https://appjusto.com.br/';

export const MessageCard = ({
  title,
  body,
  notifySelected,
}: MessageCardProps) => {
  const { copyToClipboard, isCopied } = useClipboard();
  const handleCopy = React.useCallback(() => {
    const msg = `${title} ${body} - ${mainUrl}`;
    copyToClipboard(msg);
    const encoded = encodeURIComponent(msg);
    notifySelected(encoded);
  }, [title, body, copyToClipboard, notifySelected]);
  return (
    <Box bgColor="#F6F6F6" borderRadius="lg" p="4">
      <Text fontWeight="semibold">{title}</Text>
      <Text>{body}</Text>
      <HStack
        mt="4"
        spacing={2}
        onClick={handleCopy}
        cursor="pointer"
        _hover={{ color: 'black' }}
      >
        <Text>{isCopied ? t('Copiado!') : t('Copiar')}</Text>
        <Icon as={MdOutlineFileCopy} />
      </HStack>
    </Box>
  );
};
