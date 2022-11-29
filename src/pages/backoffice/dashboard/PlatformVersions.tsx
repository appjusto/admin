import { PlatformAccess } from '@appjusto/types';
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
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
    courier: courierVersion,
    businessWeb: businessWebVersion,
    businessApp: businessAppVersion,
  } = currentVersions ?? {};
  // context
  const { isBackofficeSuperuser } = useContextFirebaseUser();
  const { updatePlatformAccess, updatePlatformAccessResult } =
    useUpdatePlatform();
  // state
  const [consumer, setConsumer] = React.useState('');
  const [courier, setCourier] = React.useState('');
  const [businessWeb, setBusinessWeb] = React.useState('');
  const [businessApp, setBusinessApp] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  // handlers
  const updateCurrentVersions = () => {
    if (!isBackofficeSuperuser) return;
    const changes = {
      currentVersions: {
        consumer,
        courier,
        businessWeb,
        businessApp,
      },
    } as Partial<PlatformAccess>;
    updatePlatformAccess(changes);
  };
  // side effects
  React.useEffect(() => {
    if (consumerVersion) setConsumer(consumerVersion);
    if (courierVersion) setCourier(courierVersion);
    if (businessWebVersion) setBusinessWeb(businessWebVersion);
    if (businessAppVersion) setBusinessApp(businessAppVersion);
  }, [consumerVersion, courierVersion, businessWebVersion, businessAppVersion]);
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
        <Wrap mt="2" justify="space-between">
          <WrapItem>
            <Text fontWeight="500">
              {t('App Consumidor: ')}
              <Text as="span" fontWeight="700">
                {consumer ?? 'N/E'}
              </Text>
            </Text>
          </WrapItem>
          <WrapItem>
            <Text fontWeight="500">
              {t('App Entregador: ')}
              <Text as="span" fontWeight="700">
                {courier ?? 'N/E'}
              </Text>
            </Text>
          </WrapItem>
          <WrapItem>
            <Text fontWeight="500">
              {t('Restaurantes web: ')}
              <Text as="span" fontWeight="700">
                {businessWeb ?? 'N/E'}
              </Text>
            </Text>
          </WrapItem>
          <WrapItem>
            <Text fontWeight="500">
              {t('Restaurante mobile: ')}
              <Text as="span" fontWeight="700">
                {businessApp ?? 'N/E'}
              </Text>
            </Text>
          </WrapItem>
        </Wrap>
      ) : (
        <>
          <Wrap mt="2" justify="space-between">
            <WrapItem>
              <CustomInput
                id="consumer-version"
                mt="0"
                maxW={{ md: '220px' }}
                value={consumer}
                onChange={(ev) => setConsumer(ev.target.value)}
                label={t('App Consumidor')}
                // placeholder={t('Digite o valor buscado')}
              />
            </WrapItem>
            <WrapItem>
              <CustomInput
                id="courier-version"
                mt="0"
                maxW={{ md: '220px' }}
                value={courier}
                onChange={(ev) => setCourier(ev.target.value)}
                label={t('App Entregador')}
              />
            </WrapItem>
            <WrapItem>
              <CustomInput
                id="business-web-version"
                mt="0"
                maxW={{ md: '220px' }}
                value={businessWeb}
                onChange={(ev) => setBusinessWeb(ev.target.value)}
                label={t('Restaurantes web')}
              />
            </WrapItem>
            <WrapItem>
              <CustomInput
                id="business-app-version"
                mt="0"
                maxW={{ md: '220px' }}
                value={businessApp}
                onChange={(ev) => setBusinessApp(ev.target.value)}
                label={t('Restaurantes mobile')}
              />
            </WrapItem>
          </Wrap>
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
