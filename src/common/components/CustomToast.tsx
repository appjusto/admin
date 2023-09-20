import { SmallCloseIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  useToast,
} from '@chakra-ui/react';
import { LuBellRing } from 'react-icons/lu';
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
          {message?.description && (
            <Text fontSize="xs">{message.description}</Text>
          )}
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
      p="6"
      bg="#FFF6D9"
      border="1px solid #FFBE00"
      borderRadius="lg"
      w={{ base: '100%', md: 'auto' }}
      maxW={{ base: '100vw', md: 'auto' }}
      mb="6"
    >
      <Flex w="full" justifyContent="space-between" alignItems="center">
        <Box pr="4">
          <HStack spacing={2} w="full" alignItems="center">
            <Icon as={LuBellRing} color="#FFBE00" w="4" h="4" />
            <Text color="black" fontSize="lg" fontWeight="medium">
              {t('Clique para habilitar a campainha dos pedidos!')}
            </Text>
          </HStack>
          <Text fontSize="sm">
            {t(
              'Esta ação é necessária sempre que a aba for carregada, devido a uma restrição imposta pelos navegadores.'
            )}
          </Text>
        </Box>
        <Button
          size="md"
          variant="yellowDark"
          border="none"
          px="6"
          onClick={() => toast.closeAll()}
        >
          {t('Habilitar')}
        </Button>
      </Flex>
    </Box>
  );
};
