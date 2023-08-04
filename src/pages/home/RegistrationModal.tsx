import { Box, Button, Link, Text } from '@chakra-ui/react';
import { BaseModal } from 'common/components/BaseModal';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose(): void;
}

export const RegistrationModal = ({
  isOpen,
  onClose,
}: RegistrationModalProps) => {
  // context
  // state
  // side effects
  // UI
  return (
    <BaseModal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      title={t('Importação do cardápio para o AppJusto')}
    >
      <Box mt="-2" mb="4">
        <Text>
          {t(
            'Caso você possua um cardápio cadastrado em outra plataforma, nosso suporte pode verificar a viabilidade de realizar a sua importação para o AppJusto.'
          )}
        </Text>
        <Box
          mt="4"
          border="1px solid #FFBE00"
          borderRadius="lg"
          bgColor="#FFF6D9"
          p="4"
        >
          <Text>
            {t(
              'Caso você use o centralizador de pedidos do Hubster, vá até a '
            )}
            <Link
              as={RouterLink}
              to="/app/integrations"
              fontWeight="semibold"
              textDecor="underline"
            >
              {t('tela de integrações')}
            </Link>
            {t(
              ' e ative sua integração com a opção "Usar cardápio do Hubster".'
            )}
          </Text>
        </Box>
        <Link
          href="https://api.whatsapp.com/send?phone=5511978210274"
          isExternal
        >
          <Button mt="4">Falar com o suporte</Button>
        </Link>
      </Box>
    </BaseModal>
  );
};
