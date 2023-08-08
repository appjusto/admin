import { Box, HStack, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface MessageCardProps {
  title: string;
  body: string;
}

export const MessageCard = ({ title, body }: MessageCardProps) => {
  return (
    <Box bgColor="#F6F6F6" borderRadius="lg" p="4">
      <Text fontWeight="semibold">{title}</Text>
      <Text>{body}</Text>
      <HStack mt="4" spacing={6}>
        <Text>{t('Copiar')}</Text>
        <Text>{t('Compartilhar')}</Text>
      </HStack>
    </Box>
  );
};
