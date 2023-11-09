import { PlatformAccess } from '@appjusto/types';
import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useUpdatePlatform } from 'app/api/platform/useUpdatePlatform';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';

interface PlatformVersionsProps {
  currentVersions?: PlatformAccess['currentVersions'];
}

export const PlatformVersions = ({
  currentVersions,
}: PlatformVersionsProps) => {
  // props
  const {
    consumer: consumerVersion,
    consumerWeb: consumerWebVersion,
    courier: courierVersion,
    businessWeb: businessWebVersion,
    businessApp: businessAppVersion,
    ordersWeb: ordersWebVersion,
  } = currentVersions ?? {};
  // context
  const { isBackofficeSuperuser } = useContextFirebaseUser();
  const { updatePlatformAccess, updatePlatformAccessResult } =
    useUpdatePlatform();
  // state
  const [consumer, setConsumer] = React.useState('');
  const [consumerWeb, setConsumerWeb] = React.useState('');
  const [courier, setCourier] = React.useState('');
  const [businessWeb, setBusinessWeb] = React.useState('');
  const [businessApp, setBusinessApp] = React.useState('');
  const [ordersWeb, setOrdersWeb] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  // handlers
  const updateCurrentVersions = () => {
    if (!isBackofficeSuperuser) return;
    const changes = {
      currentVersions: {
        consumer,
        consumerWeb,
        courier,
        businessWeb,
        businessApp,
        ordersWeb,
      },
    } as Partial<PlatformAccess>;
    updatePlatformAccess(changes);
  };
  // side effects
  React.useEffect(() => {
    if (consumerVersion) setConsumer(consumerVersion);
    if (consumerWebVersion) setConsumerWeb(consumerWebVersion);
    if (courierVersion) setCourier(courierVersion);
    if (businessWebVersion) setBusinessWeb(businessWebVersion);
    if (businessAppVersion) setBusinessApp(businessAppVersion);
    if (ordersWebVersion) setOrdersWeb(ordersWebVersion);
  }, [
    consumerVersion,
    consumerWebVersion,
    courierVersion,
    businessWebVersion,
    businessAppVersion,
    ordersWebVersion,
  ]);
  React.useEffect(() => {
    if (!updatePlatformAccessResult.isSuccess) return;
    setIsEditing(false);
  }, [updatePlatformAccessResult.isSuccess]);
  // UI
  return (
    <Box mt="4" border="1px solid #E5E5E5" borderRadius="lg" py="4" px="8">
      <Flex justifyContent="space-between">
        <Text fontSize="20px" fontWeight="500" color="black">
          {t('Versões da plataforma:')}
        </Text>
        {isBackofficeSuperuser && !isEditing && (
          <Text
            fontSize="sm"
            color="green.600"
            textDecor="underline"
            cursor="pointer"
            onClick={() => setIsEditing(true)}
          >
            {t('Editar')}
          </Text>
        )}
      </Flex>
      {!isEditing ? (
        <Flex
          mt="4"
          flexDir={{ base: 'column', md: 'row' }}
          gap={{ base: 6, lg: 14 }}
          fontSize="sm"
        >
          <VStack spacing={1} alignItems="flex-start">
            <Text fontWeight="semibold">{t('Consumidor:')}</Text>
            <Text fontWeight="500">
              {t('Mobile ')}
              <Text as="span" fontWeight="700">
                {consumer ?? 'N/E'}
              </Text>
            </Text>
            <Text fontWeight="500">
              {t('Web ')}
              <Text as="span" fontWeight="700">
                {consumerWeb ?? 'N/E'}
              </Text>
            </Text>
          </VStack>

          <VStack spacing={1} alignItems="flex-start">
            <Text fontWeight="semibold">{t('Entregador:')}</Text>
            <Text fontWeight="500">
              {t('Mobile: ')}
              <Text as="span" fontWeight="700">
                {courier ?? 'N/E'}
              </Text>
            </Text>
          </VStack>

          <VStack spacing={1} alignItems="flex-start">
            <Text fontWeight="semibold">{t('Restaurante:')}</Text>
            <Text fontWeight="500">
              {t('Admin/backoffice: ')}
              <Text as="span" fontWeight="700">
                {businessWeb ?? 'N/E'}
              </Text>
            </Text>
            <Text fontWeight="500">
              {t('Gestor web: ')}
              <Text as="span" fontWeight="700">
                {ordersWeb ?? 'N/E'}
              </Text>
            </Text>
            <Text fontWeight="500">
              {t('Gestor mobile: ')}
              <Text as="span" fontWeight="700">
                {businessApp ?? 'N/E'}
              </Text>
            </Text>
          </VStack>
        </Flex>
      ) : (
        <>
          <Flex
            mt="4"
            flexDir={{ base: 'column', md: 'row' }}
            gap={{ base: 6, lg: 14 }}
            fontSize="sm"
          >
            <VStack spacing={1} alignItems="flex-start">
              <Text fontWeight="semibold">{t('Consumidor:')}</Text>
              <CustomInput
                mt="0"
                id="consumer-mob-version"
                maxW={{ md: '220px' }}
                value={consumer}
                onChange={(ev) => setConsumer(ev.target.value)}
                label={t('Mobile')}
                // placeholder={t('Digite o valor buscado')}
              />
              <CustomInput
                mt="0"
                id="consumer-web-version"
                maxW={{ md: '220px' }}
                value={consumerWeb}
                onChange={(ev) => setConsumerWeb(ev.target.value)}
                label={t('Web')}
                // placeholder={t('Digite o valor buscado')}
              />
            </VStack>

            <VStack spacing={1} alignItems="flex-start">
              <Text fontWeight="semibold">{t('Entregador:')}</Text>
              <CustomInput
                id="courier-version"
                mt="0"
                maxW={{ md: '220px' }}
                value={courier}
                onChange={(ev) => setCourier(ev.target.value)}
                label={t('Mobile')}
              />
            </VStack>

            <VStack spacing={1} alignItems="flex-start">
              <Text fontWeight="semibold">{t('Restaurante:')}</Text>
              <CustomInput
                id="business-admin-version"
                mt="0"
                maxW={{ md: '220px' }}
                value={businessWeb}
                onChange={(ev) => setBusinessWeb(ev.target.value)}
                label={t('Admin/backoffice')}
              />
              <CustomInput
                id="business-orders-version"
                mt="0"
                maxW={{ md: '220px' }}
                value={ordersWeb}
                onChange={(ev) => setOrdersWeb(ev.target.value)}
                label={t('Gestor web')}
              />
              <CustomInput
                id="business-app-version"
                mt="0"
                maxW={{ md: '220px' }}
                value={businessApp}
                onChange={(ev) => setBusinessApp(ev.target.value)}
                label={t('Gestor mobile')}
              />
            </VStack>
          </Flex>
          <Flex mt="4" justifyContent="flex-end">
            <HStack>
              <Button
                size="md"
                minW="100px"
                variant="dangerLight"
                onClick={() => setIsEditing(false)}
              >
                {t('Cancelar')}
              </Button>
              <Button
                size="md"
                minW="100px"
                onClick={updateCurrentVersions}
                isLoading={updatePlatformAccessResult.isLoading}
                loadingText={t('Salvando')}
              >
                {t('Salvar')}
              </Button>
            </HStack>
          </Flex>
        </>
      )}
    </Box>
  );
};
