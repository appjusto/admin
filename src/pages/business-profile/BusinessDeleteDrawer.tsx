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
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const BusinessDeleteDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { isBackofficeUser } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { deleteBusinessProfile, deleteResult } = useBusinessProfile();
  const { isSuccess, isError, error: deleteError, isLoading } = deleteResult;
  // state
  const [businessName, setBusinessName] = React.useState('');
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
  //handlers
  const handleDelete = async () => {
    submission.current += 1;
    if (business?.name && businessName !== business?.name) {
      return setError({
        status: true,
        error: null,
        message: { title: 'Favor preencher o nome do restaurante corretamente!' },
      });
    } else {
      await deleteBusinessProfile();
    }
  };
  // side effects
  React.useEffect(() => {
    if (isError)
      setError({
        status: true,
        error: deleteError,
      });
  }, [isError, deleteError]);
  //UI
  if (isSuccess) {
    if (!isBackofficeUser) return <Redirect to="/logout" push />;
    else return <Redirect to="/backoffice" push />;
  }
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
                  isDisabled={businessName !== business?.name}
                >
                  {t('Excluir restaurante')}
                </Button>
              </Stack>
            </Box>
            <SuccessAndErrorHandler
              submission={submission.current}
              isSuccess={isSuccess}
              isError={error.status}
              error={error.error}
              errorMessage={error.message}
            />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
