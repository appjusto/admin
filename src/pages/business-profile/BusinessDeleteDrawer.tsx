import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { getErrorMessage } from 'core/fb';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const BusinessDeleteDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { deleteBusinessProfile, result } = useBusinessProfile();
  const { isSuccess, isError, error, isLoading } = result;
  //handlers
  const handleDelete = async () => {
    await deleteBusinessProfile();
    if (isSuccess) return <Redirect to="/login" />;
  };
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Flex flexDir="column">
                <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
                  {t('Excluir restaurante')}
                </Text>
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerBody pb="28">
            <Box bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
              <Text color="red">
                {t(
                  'Ao excluir o restaurante, todo o seu histórico de pedidos, itens adicionados, categorias, informes de transação financeira, serão apagados. Tem certeza que deseja excluir o restaurante?'
                )}
              </Text>
              <Stack mt="8" spacing={4} direction="row">
                <Button width="full" onClick={onClose}>
                  {t('Manter restaurante')}
                </Button>
                <Button
                  width="full"
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isLoading}
                  loadingText={t('Excluindo')}
                >
                  {t('Excluir restaurante')}
                </Button>
              </Stack>
            </Box>
            {isError && (
              <Box mt="6">
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>{t('Erro!')}</AlertTitle>
                  <AlertDescription>
                    {getErrorMessage(error) ?? t('Tenta de novo?')}
                  </AlertDescription>
                </Alert>
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
