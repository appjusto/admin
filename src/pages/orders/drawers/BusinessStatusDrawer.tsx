import { Business } from '@appjusto/types';
import {
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
  Switch as ChakraSwitch,
  Text,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { t } from 'utils/i18n';

interface BusinessStatusDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const BusinessStatusDrawer = ({
  onClose,
  ...props
}: BusinessStatusDrawerProps) => {
  //context
  const { isBackofficeUser } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(
    business?.id
  );
  // status
  const [status, setStatus] = React.useState(business?.status ?? 'unavailable');
  //handlers
  const handleStatusSave = async () => {
    const changes = {
      status,
    } as Partial<Business>;
    try {
      updateBusinessProfile(changes);
    } catch (error) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'operation-submit-error',
        message: { title: 'Não foi possível salvar as informações.' },
      });
    }
  };
  // side effects

  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent
          // mt={isHistory ? { base: '16', lg: '0' } : '0'}
          pt={isBackofficeUser ? '16' : 0}
        >
          <DrawerCloseButton
            bg="green.500"
            mr="12px"
            _focus={{ outline: 'none' }}
          />
          <DrawerHeader pb="2">
            <Text
              mt="4"
              color="black"
              fontSize="2xl"
              fontWeight="700"
              lineHeight="28px"
              mb="2"
            >
              {t('Fechamento de emergência')}
            </Text>
          </DrawerHeader>
          <DrawerBody pos="relative" pb="28">
            <Text mt="2" fontSize="md">
              {t(
                'Ao ativar o fechamento de emergência o seu restaurante aparecerá como fechado, desconsiderando os horários de funcionamento configurados, até que esta funcionalidade seja desativada manualmente'
              )}
            </Text>
            <Flex mt="4" alignItems="center">
              <ChakraSwitch
                isChecked={status !== 'available'}
                onChange={(ev) => {
                  ev.stopPropagation();
                  setStatus(ev.target.checked ? 'unavailable' : 'available');
                }}
              />
              <Flex ml="4" flexDir="column" minW="280px">
                <Text fontSize="16px" fontWeight="700" lineHeight="22px">
                  {status === 'available' ? t('Desativado') : t('Ativado')}
                </Text>
              </Flex>
            </Flex>
            {business?.status === 'unavailable' && (
              <Flex
                mt="4"
                p="4"
                border="1px solid black"
                borderRadius="lg"
                bg="yellow"
                color="black"
              >
                <Icon as={RiErrorWarningLine} w="24px" h="24px" />
                <Text ml="4">
                  {t(
                    'Seu restaurante não está disponível para receber pedidos.'
                  )}
                </Text>
              </Flex>
            )}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <Flex w="full" justifyContent="flex-start">
              <Flex
                w="full"
                maxW="607px"
                pr="12"
                flexDir="row"
                justifyContent="space-between"
              >
                <Button
                  width="full"
                  maxW="200px"
                  onClick={handleStatusSave}
                  isLoading={updateResult.isLoading}
                >
                  {t('Salvar')}
                </Button>
              </Flex>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
