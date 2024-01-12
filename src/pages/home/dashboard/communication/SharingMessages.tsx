import { Box, HStack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import ShareLink from 'common/components/landing/share/ShareLink';
import React from 'react';
import {
  FaFacebookSquare,
  FaLinkedin,
  FaTwitterSquare,
  FaWhatsappSquare,
} from 'react-icons/fa';
import { t } from 'utils/i18n';
import { MessageCard } from './MessageCard';

const mainUrl = 'https://appjusto.com.br/';

export const SharingMessages = () => {
  const [selected, setSelected] = React.useState<string>();
  return (
    <Box mt="6" border="1px solid #C8D7CB" borderRadius="lg" px="4" py="6">
      <Text fontSize="2xl" fontWeight="semibold">
        {t('Divulgue esse movimento')}
      </Text>
      <Text>
        {t(
          'Compartilhe com outros restaurantes, consumidores, entregadores, pessoas conhecidas. '
        )}
        <Text as="span" fontWeight="semibold">
          {t(
            'Quanto maior for nossa rede de indicações, mais forte será nossa comunidade - e mais pedidos serão feitos!'
          )}
        </Text>
      </Text>
      <Box mt="6" w="100%" pb="2" overflow="auto">
        <HStack minW={{ lg: '1374px' }} spacing={4}>
          <MessageCard
            title={t('Você conhece o AppJusto?')}
            body={t(
              'O appjusto é uma plataforma que oferece regras e taxas justas para entregadores e restaurantes. Com o compromisso de ganhar apenas o mínimo necessário para se manter, a plataforma permite que os consumidores economizem enquanto entregadores e restaurantes ganham mais 💚👊'
            )}
            notifySelected={(msg) => setSelected(msg)}
          />
          <MessageCard
            title={t('Você conhece o AppJusto?')}
            body={t(
              'O appjusto é uma plataforma que oferece regras e taxas justas para entregadores e restaurantes. Com o compromisso de ganhar apenas o mínimo necessário para se manter, a plataforma permite que os consumidores economizem enquanto entregadores e restaurantes ganham mais 💚👊'
            )}
            notifySelected={(msg) => setSelected(msg)}
          />
        </HStack>
      </Box>
      <Wrap mt="6" w="100%" gap={4}>
        <WrapItem w="100%" maxW={{ lg: '140px' }}>
          <ShareLink
            link={`https://api.whatsapp.com/send?text=${selected ?? mainUrl}`}
            label="Whatsapp"
            icon={FaWhatsappSquare}
            variant="dark"
          />
        </WrapItem>
        <WrapItem w="100%" maxW={{ lg: '140px' }}>
          <ShareLink
            link={`https://www.facebook.com/sharer/sharer.php?u=${mainUrl}%3Fsource%3Dsocial.fb&display=page&facebook%2Fclose`}
            label="Facebook"
            icon={FaFacebookSquare}
            variant="dark"
          />
        </WrapItem>
        <WrapItem w="100%" maxW={{ lg: '140px' }}>
          <ShareLink
            link={`https://twitter.com/intent/tweet?text=${
              selected ?? mainUrl
            }`}
            label="Twitter"
            icon={FaTwitterSquare}
            variant="dark"
          />
        </WrapItem>
        <WrapItem w="100%" maxW={{ lg: '140px' }}>
          <ShareLink
            link={`https://www.linkedin.com/sharing/share-offsite/?url=${mainUrl}`}
            label="Linkedin"
            icon={FaLinkedin}
            variant="dark"
          />
        </WrapItem>
      </Wrap>
    </Box>
  );
};
