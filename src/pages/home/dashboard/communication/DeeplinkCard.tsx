import { CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Input,
  Text,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useMeasurement } from 'app/api/measurement/useMeasurement';
import { useContextBusiness } from 'app/state/business/context';
import { FirebaseError } from 'firebase/app';
import React from 'react';
import { FiShare2 } from 'react-icons/fi';
import { MdErrorOutline } from 'react-icons/md';
import { slugify } from 'utils/formatters';
import { t } from 'utils/i18n';

export const DeeplinkCard = () => {
  // context
  const { analyticsLogEvent } = useMeasurement();
  const { business } = useContextBusiness();
  const { createBusinessSlug, updateBusinessSlug, updateSlugResult } =
    useBusinessProfile(business?.id);
  // state
  const [slug, setSlug] = React.useState('');
  const [error, setError] = React.useState<string>();
  const [deeplink, setDeeplink] = React.useState('');
  const [isCopied, setIsCopied] = React.useState(false);
  // helpers
  const isInvalid =
    business?.slug === undefined && slugify(business?.name ?? '') === slug;
  // handlers
  const handleCreation = React.useCallback(async () => {
    if (!business?.id || !business?.name) return;
    const newSlug = slugify(business?.name);
    try {
      await createBusinessSlug({ businessId: business.id, slug: newSlug });
      setSlug(newSlug);
    } catch (error) {
      const code = (error as FirebaseError).code;
      setError(code);
      setSlug(newSlug);
    }
  }, [business?.id, business?.name, createBusinessSlug]);
  const handleUpdate = () => {
    if (!business?.id || !slug) return;
    updateBusinessSlug({ businessId: business.id, slug });
  };
  const copyToClipboard = () => {
    setIsCopied(true);
    analyticsLogEvent({ eventName: 'admin_deeplink_copy' });
    setTimeout(() => setIsCopied(false), 500);
    return navigator.clipboard.writeText(deeplink);
  };
  // side effects
  React.useEffect(() => {
    if (!business?.slug) {
      handleCreation();
    } else {
      const deeplink =
        process.env.REACT_APP_ENVIRONMENT === 'live'
          ? `https://appjusto.com.br/r/${business.slug}`
          : `https://${process.env.REACT_APP_ENVIRONMENT}.appjusto.com.br/r/${business.slug}`;
      setSlug(business.slug);
      setDeeplink(deeplink);
    }
  }, [business?.slug, business?.name, handleCreation]);
  // UI
  if (business?.slug) {
    return (
      <Flex
        mt="4"
        flexDir={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        px="4"
        py="6"
        bgColor="#F6F6F6"
        borderRadius="lg"
      >
        <Flex>
          <Center
            bgColor="#C8D7CB"
            borderRadius="lg"
            w="56px"
            minW="56px"
            h="56px"
          >
            <Icon as={FiShare2} w="6" h="6" />
          </Center>
          <Box ml="4" maxW="554px">
            <Text fontWeight="semibold">
              {t('Compartilhe o link do seu restaurante no AppJusto')}
            </Text>
            <Text>
              {t(
                'Copie o link do seu cardápio e divulgue nas suas redes sociais!'
              )}
            </Text>
            <Input
              mt="4"
              id="auto-slug"
              maxW="524px"
              h="60px"
              border="1px solid #C8D7CB"
              borderRadius="lg"
              bgColor="white"
              value={deeplink}
              isReadOnly
            />
          </Box>
        </Flex>
        <Button
          mt={{ base: '4', md: '0' }}
          size="md"
          fontSize="sm"
          minW="112px"
          w={{ base: '100%', md: 'auto' }}
          onClick={copyToClipboard}
        >
          {t('Copiar link')}
          {isCopied && <CheckIcon ml="2" />}
        </Button>
      </Flex>
    );
  }
  return (
    <Flex
      mt="4"
      flexDir={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      px="4"
      py="6"
      bgColor="#F6F6F6"
      borderRadius="lg"
    >
      <Flex>
        <Center
          bgColor="#C8D7CB"
          borderRadius="lg"
          w="56px"
          minW="56px"
          h="56px"
        >
          <Icon as={FiShare2} w="6" h="6" />
        </Center>
        <Box ml="4" maxW="554px">
          <Text fontWeight="semibold">
            {t('Crie e compartilhe o link do seu restaurante no AppJusto')}
          </Text>
          <Text>
            {t('Edite o final do link abaixo e gere o link do seu cardápio')}
          </Text>
          {error === 'already-exists' && (
            <HStack mt="2" fontSize="sm" color="red">
              <MdErrorOutline />
              <Text>
                {t('O final ')}
                <Text as="span" fontWeight="semibold">
                  {slugify(business?.name ?? '')}
                </Text>
                {t(' já está sendo usado por outro restaurante.')}
              </Text>
            </HStack>
          )}
          <Flex mt="4">
            <Flex
              h="60px"
              border="1px solid #C8D7CB"
              borderTopLeftRadius="lg"
              borderBottomLeftRadius="lg"
              bgColor="#F6F6F6"
              alignItems="center"
              pl="4"
              pr="2"
            >
              <Text>https://appjusto.com.br/r/</Text>
            </Flex>
            <Input
              id="custom-slug"
              maxW="524px"
              h="60px"
              border="1px solid"
              borderColor={isInvalid ? 'red' : '#C8D7CB'}
              borderLeftRadius="0"
              borderRightRadius="lg"
              bgColor="white"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              onBlur={(e) => setSlug(slugify(e.target.value, true))}
            />
          </Flex>
        </Box>
      </Flex>
      <Button
        mt={{ base: '4', md: '0' }}
        size="md"
        fontSize="sm"
        minW="112px"
        w={{ base: '100%', md: 'auto' }}
        onClick={handleUpdate}
        isLoading={updateSlugResult.isLoading}
      >
        {t('Gerar link')}
      </Button>
    </Flex>
  );
};
