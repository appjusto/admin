import { HubsterStoreStatus } from '@appjusto/types';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Image,
  Switch as ChakraSwitch,
  Text,
} from '@chakra-ui/react';
import { useHubsterStore } from 'app/api/business/useHubsterStore';
import { useObserveHubsterStore } from 'app/api/business/useObserveHubsterStore';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import logo from 'common/img/hubster-logo.png';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { t } from 'utils/i18n';

interface HubsterDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const HubsterDrawer = ({ onClose, ...props }: HubsterDrawerProps) => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { isBackofficeUser, userAbility } = useContextFirebaseUser();
  const businessId = useContextBusinessId();
  const hubsterStore = useObserveHubsterStore(businessId);
  const { updateHubsterStore, updateHubsterStoreResult } = useHubsterStore();
  const { isLoading } = updateHubsterStoreResult;
  // state
  const [storeId, setStoreId] = React.useState('');
  const [status, setStatus] = React.useState<HubsterStoreStatus>('available');
  // handlers
  const saveStore = () => {
    if (!businessId) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'HubsterDrawer-invalid-businessId',
        message: {
          title: 'Não foi possível encontrar as informações do restaurnate.',
        },
      });
    }
    if (userAbility?.cannot('update', 'integrations')) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'HubsterDrawer-not allowed',
        message: {
          title: 'Permissão negada.',
        },
      });
    }
    const changes = {
      businessId,
      status,
      storeId,
    };
    console.log(changes);
    return updateHubsterStore({ docId: hubsterStore?.id, changes });
  };
  // side effects
  React.useEffect(() => {
    if (!hubsterStore) return;
    setStoreId(hubsterStore.storeId);
    setStatus(hubsterStore.status);
  }, [hubsterStore]);
  // UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          saveStore();
        }}
      >
        <DrawerOverlay>
          <DrawerContent
            pt={{ base: '76px', md: isBackofficeUser ? '16' : '0' }}
          >
            <DrawerCloseButton mt={{ base: '80px', md: '0' }} />
            <DrawerHeader>
              <Text fontSize="2xl" fontWeight="700">
                {t('Configurar integração')}
              </Text>
            </DrawerHeader>
            <DrawerBody>
              <Flex
                h="100%"
                flexDirection="column"
                justifyContent="space-between"
                pb="4"
              >
                <Box>
                  <Text fontSize="xl" fontWeight="700">
                    {t('Dados do software')}
                  </Text>
                  <Flex mt="4">
                    <Box
                      w="60px"
                      minW="60px"
                      h="60px"
                      borderRadius="lg"
                      overflow="hidden"
                    >
                      <Image src={logo} w="100%" />
                    </Box>
                    <Box ml="4" maxW="452px">
                      <Text fontSize="md" fontWeight="700" lineHeight="22px">
                        {t('Hubster')}
                      </Text>
                      <Text color="gray.700">
                        {t(
                          'O hubster é um centralizador de pedidos que permite que você controle o fluxo de pedidos de várias plataformas numa só ferramenta'
                        )}
                      </Text>
                    </Box>
                  </Flex>
                  <Text mt="6" fontSize="xl" fontWeight="700">
                    {t('Configuração')}
                  </Text>
                  <Text mt="4" color="gray.700">
                    {t(
                      'Informe o storeId que você recebeu do suporte do hubster e salve as alterações'
                    )}
                  </Text>
                  <Input
                    mt="2"
                    id="store-id"
                    label={t('StoreId *')}
                    placeholder={t('Cole o storeId obtido com o hubster')}
                    value={storeId}
                    onChange={(ev) => setStoreId(ev.target.value)}
                    isRequired
                  />
                  <Flex mt="4" alignItems="center">
                    <ChakraSwitch
                      isChecked={status === 'available'}
                      onChange={(ev) => {
                        ev.stopPropagation();
                        setStatus(
                          ev.target.checked ? 'available' : 'unavailable'
                        );
                      }}
                    />
                    <Flex ml="4" flexDir="column" minW="280px">
                      <Text fontSize="16px" fontWeight="700" lineHeight="22px">
                        {status === 'available'
                          ? t('Integração ativada')
                          : t('Integração desativada')}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
                <Flex
                  mt="4"
                  p="4"
                  flexDir="row"
                  border="1px solid black"
                  borderRadius="lg"
                >
                  <Icon mt="1" as={MdInfoOutline} />
                  <Text
                    ml="2"
                    fontSize="15px"
                    fontWeight="500"
                    lineHeight="22px"
                  >
                    {t(
                      'Ao realizar essa integração você autoriza o envio dos dados relativos ao pedido, inclusive dados dos consumidores - quando autorizado, para o Hubster'
                    )}
                  </Text>
                </Flex>
              </Flex>
            </DrawerBody>
            <DrawerFooter
              borderTop="1px solid #F2F6EA"
              justifyContent="flex-start"
            >
              <Button
                type="submit"
                fontSize="md"
                loadingText={t('Salvando')}
                isLoading={isLoading}
              >
                {t('Salvar as alterações')}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </form>
    </Drawer>
  );
};
