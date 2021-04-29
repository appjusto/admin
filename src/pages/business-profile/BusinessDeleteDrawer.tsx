import {
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
import { useContextBusiness } from 'app/state/business/context';
import { AlertError } from 'common/components/AlertError';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
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
  const { business } = useContextBusiness();
  const { deleteBusinessProfile, updateResult: result } = useBusinessProfile();
  const { isSuccess, isError, error, isLoading } = result;
  // state
  const [businessName, setBusinessName] = React.useState('');
  const [drawerError, setDrawerError] = React.useState({ status: false, message: '' });
  //handlers
  const handleDelete = async () => {
    if (business?.name && businessName !== business?.name) {
      return setDrawerError({
        status: true,
        message: 'Favor preencher o nome do restaurante corretamente!',
      });
    } else {
      setDrawerError({ status: false, message: '' });
      await deleteBusinessProfile();
    }
  };
  //UI
  if (isSuccess) return <Redirect to="/logout" push />;
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
                {t('Nome do restaurante: ')}
                <Text as="span" fontWeight="700">
                  {business?.name ?? t('Não informado')}
                </Text>
              </Text>
              <Text mt="4" color="red">
                {t(
                  'Ao excluir o restaurante, todo o seu histórico de pedidos, itens adicionados, categorias, informes de transação financeira, serão apagados. Tem certeza que deseja excluir o restaurante?'
                )}
              </Text>
              {business?.name && (
                <>
                  <Text mt="4" color="red">
                    {t(`Para confirmar, digite o nome do restaurante no campo abaixo: `)}
                  </Text>
                  <Input
                    mt="2"
                    bg="white"
                    id="confirm-name"
                    label={t('Nome do restaurante')}
                    value={businessName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setBusinessName(event.target.value)
                    }
                  />
                </>
              )}
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
            {(isError || drawerError.status) && (
              <AlertError
                title={t('Erro!')}
                description={
                  drawerError.status
                    ? drawerError.message
                    : getErrorMessage(error) || t('Erro genérico')
                }
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
