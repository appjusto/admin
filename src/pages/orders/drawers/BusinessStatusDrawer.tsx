import { Business, BusinessStatus } from '@appjusto/types';
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
  HStack,
  Icon,
  Image,
  Text,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import iconTraffic from 'common/img/icon-traffic.svg';
import React from 'react';
import { FiClock } from 'react-icons/fi';
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
  // const [status, setStatus] = React.useState(business?.status ?? 'unavailable');
  const [isConfirming, setIsConfirming] = React.useState(false);
  //handlers
  const handleChangeStatus = async (status: BusinessStatus) => {
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
  React.useEffect(() => {
    if (!updateResult.isSuccess) return;
    setIsConfirming(false);
  }, [updateResult.isSuccess]);
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
            {business?.status === 'available' && (
              <Flex
                flexDir="row"
                py="4"
                px="6"
                border="1px solid black"
                borderRadius="lg"
                mb="4"
              >
                <Icon mt="3px" as={FiClock} color="black" />
                <Text ml="2" fontSize="md" lineHeight="22px">
                  {t(
                    'Seu restaurante está funcionando de acordo com os horários definidos.'
                  )}
                </Text>
              </Flex>
            )}
            <HStack
              spacing={6}
              py="4"
              px="6"
              bgColor="#FFF8F8"
              border="1px solid #DC3545"
              borderRadius="lg"
            >
              <Box w="60px" minW="60px">
                <Image src={iconTraffic} />
              </Box>
              {business?.status === 'unavailable' ? (
                <Box>
                  <Text fontWeight="700">
                    {t('Fechamento de emergência ativado. ')}
                  </Text>
                  <Text fontSize="md">
                    {t(
                      'Seu restaurante não está disponível para receber pedidos.'
                    )}
                  </Text>
                </Box>
              ) : (
                <Text fontSize="md">
                  {t(
                    'Ao ativar o fechamento de emergência, o seu restaurante '
                  )}
                  <Text as="span" fontWeight="700">
                    {t('permanecerá fechado')}
                  </Text>
                  {t(
                    ' até o horário de abertura do próximo dia de funcionamento.'
                  )}
                </Text>
              )}
            </HStack>
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <Flex w="full" justifyContent="flex-start" pr="64px">
              {isConfirming ? (
                <Box
                  p="4"
                  w="100%"
                  bgColor="#FFF8F8"
                  border="1px solid red"
                  borderRadius="lg"
                >
                  <Text fontSize="15px" fontWeight="700">
                    {t(
                      'Tem certeza que deseja ativar o fechamento de emergência?'
                    )}
                  </Text>
                  <HStack mt="4">
                    <Button
                      w="100%"
                      // size="sm"
                      onClick={() => setIsConfirming(false)}
                    >
                      {t('Voltar')}
                    </Button>
                    <Button
                      w="100%"
                      // size="sm"
                      variant="danger"
                      onClick={() => handleChangeStatus('unavailable')}
                      isLoading={updateResult.isLoading}
                      loadingText={t('Confirmando')}
                    >
                      {t('Confirmar fechamento')}
                    </Button>
                  </HStack>
                </Box>
              ) : business?.status === 'available' ? (
                <Button
                  width="full"
                  maxW="50%"
                  variant="dangerLight"
                  onClick={() => setIsConfirming(true)}
                  isLoading={updateResult.isLoading}
                >
                  {t('Ativar fechamento')}
                </Button>
              ) : (
                <Button
                  width="full"
                  maxW="50%"
                  onClick={() => handleChangeStatus('available')}
                  isLoading={updateResult.isLoading}
                >
                  {t('Desativar fechamento')}
                </Button>
              )}
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
