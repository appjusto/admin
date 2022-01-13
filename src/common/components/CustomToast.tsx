import { BellIcon, SmallCloseIcon, WarningIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, Text, useToast } from '@chakra-ui/react';
import { t } from 'utils/i18n';

type Message = { title: string; description?: string };
interface CustomToastProps {
  type: 'success' | 'warning' | 'error';
  message: Message;
}

export const CustomToast = ({ type, message }: CustomToastProps) => {
  // contex
  const toast = useToast();
  // helpers
  let bg = '#48BB78';
  if (type === 'warning') bg = '#ED8936';
  if (type === 'error') bg = '#E53E3E';
  // UI
  return (
    <Box
      pos="relative"
      color="white"
      p="4"
      bg={bg}
      borderRadius="lg"
      w={{ base: '100%', md: 'auto' }}
      maxW={{ base: '100vw', md: 'auto' }}
    >
      <SmallCloseIcon
        pos="absolute"
        top="2"
        right="3"
        cursor="pointer"
        onClick={() => toast.closeAll()}
      />
      <HStack spacing={4} pr="6">
        <WarningIcon />
        <Box>
          <Text>{message.title}</Text>
          {message?.description && <Text fontSize="xs">{message.description}</Text>}
        </Box>
      </HStack>
    </Box>
  );
};

export const CustomToastAutoPlay = () => {
  // contex
  const toast = useToast();
  // UI
  return (
    <Box
      pos="relative"
      color="white"
      p="8"
      bg="#F6F6F6"
      border="1px solid black"
      borderRadius="lg"
      w={{ base: '100%', md: 'auto' }}
      maxW={{ base: '100vw', md: 'auto' }}
    >
      <SmallCloseIcon
        pos="absolute"
        top="2"
        right="3"
        cursor="pointer"
        onClick={() => toast.closeAll()}
      />
      <HStack spacing={4} pr="6">
        <BellIcon color="black" />
        <Box>
          <Text color="black">{t('Clique para habilitar a campainha dos pedidos!')}</Text>
        </Box>
        <Button size="md" onClick={() => toast.closeAll()}>
          {t('Ok')}
        </Button>
      </HStack>
    </Box>
  );
};
