import { Button, Center, Flex, Icon, Text } from '@chakra-ui/react';
import { ImWhatsapp } from 'react-icons/im';
import { t } from 'utils/i18n';

export const WhatsGroups = () => {
  return (
    <Flex
      mt="6"
      bgColor="#D7E7DA"
      borderRadius="lg"
      px="4"
      py="6"
      justifyContent="space-between"
      alignItems="center"
    >
      <Center w="50px" minW="50px" h="50px" bgColor="white" borderRadius="lg">
        <Icon as={ImWhatsapp} w="6" h="6" />
      </Center>
      <Text fontSize="xl" fontWeight="semibold" maxW="380px">
        {t('Você também pode falar no grupo do WhatsApp direto com a gente')}
      </Text>
      <Button variant="secondary">{t('Entrar')}</Button>
    </Flex>
  );
};
