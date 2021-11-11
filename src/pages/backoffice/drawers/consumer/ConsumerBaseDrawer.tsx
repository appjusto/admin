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
  Text,
} from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useConsumerUpdateProfile } from 'app/api/consumer/useConsumerUpdateProfile';
import { FirebaseError } from 'app/api/types';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { ConsumerProfile } from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { getEditableProfile } from 'pages/backoffice/utils';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface BaseDrawerProps {
  agent: { id: string | undefined; name: string };
  isOpen: boolean;
  onClose(): void;
  children: React.ReactNode | React.ReactNode[];
}

export const ConsumerBaseDrawer = ({ agent, onClose, children, ...props }: BaseDrawerProps) => {
  //context
  const queryClient = useQueryClient();
  const { url } = useRouteMatch();
  const { deleteAccount, deleteAccountResult } = useAuthentication();
  const {
    consumer,
    selfieFiles,
    setSelfieFiles,
    documentFiles,
    setDocumentFiles,
    isEditingEmail,
    setIsEditingEmail,
  } = useContextConsumerProfile();
  const { updateProfile, updateResult } = useConsumerUpdateProfile(consumer?.id);
  const { isLoading, isSuccess, isError, error: updateError } = updateResult;

  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);

  //helpers
  //const toast = useToast();
  let consumerName = consumer?.name ?? 'N/I';
  if (consumer?.surname) consumerName += ` ${consumer.surname}`;
  const city = consumer?.city && consumer?.state ? `${consumer?.city} - ${consumer?.state}` : 'N/I';

  //handlers
  const handleSave = () => {
    setError(initialError);
    submission.current += 1;
    /*if (consumer?.situation === 'approved') {
      if (!contextValidation.cpf) {
        return setError({
          status: true,
          error: null,
          message: { title: 'O CPF não foi informado ou não é válido.' },
        });
      }
    }*/
    setIsEditingEmail(false);
    const changes = getEditableProfile(consumer, isEditingEmail) as Partial<ConsumerProfile>;
    const selfieFileToSave = selfieFiles ? selfieFiles[0] : null;
    const documentFileToSave = documentFiles ? documentFiles[0] : null;
    updateProfile({ changes, selfieFileToSave, documentFileToSave });
    if (selfieFileToSave) queryClient.invalidateQueries(['consumer:selfie', consumer?.id]);
    if (documentFileToSave) queryClient.invalidateQueries(['consumer:document', consumer?.id]);
    setSelfieFiles(null);
    setDocumentFiles(null);
  };

  const handleDeleteAccount = () => {
    if (!consumer?.id) {
      setError({
        status: true,
        error: null,
        message: { title: 'Não foi possível encontrar o id deste usuário.' },
      });
    } else {
      submission.current += 1;
      deleteAccount({ accountId: consumer.id });
    }
  };

  // side effects
  React.useEffect(() => {
    if (isError) {
      setError({
        status: true,
        error: updateError,
      });
    } else if (deleteAccountResult.isError) {
      const errorMessage = (deleteAccountResult.error as FirebaseError).message;
      setError({
        status: true,
        error: deleteAccountResult.error,
        message: { title: errorMessage ?? 'Não foi possível acessar o servidor' },
      });
    }
  }, [isError, updateError, deleteAccountResult.isError, deleteAccountResult.error]);

  React.useEffect(() => {
    if (deleteAccountResult.isSuccess) onClose();
  }, [deleteAccountResult.isSuccess, onClose]);

  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {consumer?.code ?? 'N/E'}
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Data do onboarding:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(consumer?.createdOn)}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(consumer?.updatedOn)}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Cidade:')}{' '}
              <Text as="span" fontWeight="500">
                {city}
              </Text>
            </Text>
            {/*<Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Agente responsável:')}{' '}
              <Text as="span" fontWeight="500">
                *
              </Text>
            </Text>*/}
          </DrawerHeader>
          <DrawerBody pb="28">
            <SectionTitle>{consumerName}</SectionTitle>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {consumer?.situation === 'approved' ? t('Ativo') : t('Inativo')}
              </Text>
            </Text>
            <Flex
              my="8"
              fontSize="lg"
              flexDir="row"
              alignItems="flex-start"
              height="38px"
              borderBottom="1px solid #C8D7CB"
            >
              <DrawerLink to={`${url}`} label={t('Cadastro')} />
              <DrawerLink to={`${url}/orders`} label={t('Pedidos')} />
              <DrawerLink to={`${url}/status`} label={t('Status')} />
            </Flex>
            {children}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            {isDeleting ? (
              <Box mt="8" w="100%" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
                <Text color="red">{t(`Tem certeza que deseja excluir esta conta?`)}</Text>
                <HStack mt="4" spacing={4}>
                  <Button width="full" onClick={() => setIsDeleting(false)}>
                    {t(`Manter conta`)}
                  </Button>
                  <Button
                    width="full"
                    variant="danger"
                    onClick={handleDeleteAccount}
                    isLoading={deleteAccountResult.isLoading}
                  >
                    {t(`Excluir`)}
                  </Button>
                </HStack>
              </Box>
            ) : (
              <HStack w="100%" spacing={4}>
                <Button
                  width="full"
                  fontSize="15px"
                  onClick={handleSave}
                  isLoading={isLoading}
                  loadingText={t('Salvando')}
                >
                  {t('Salvar alterações')}
                </Button>
                <Button
                  width="full"
                  fontSize="15px"
                  variant="dangerLight"
                  onClick={() => setIsDeleting(true)}
                >
                  {t('Excluir conta')}
                </Button>
              </HStack>
            )}
            <SuccessAndErrorHandler
              submission={submission.current}
              isSuccess={isSuccess}
              isError={error.status}
              error={error.error}
              errorMessage={error.message}
            />
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
