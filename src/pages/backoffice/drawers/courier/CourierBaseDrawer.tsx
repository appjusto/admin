import { CourierProfile } from '@appjusto/types';
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
  Text,
} from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useCourierUpdateProfile } from 'app/api/courier/useCourierUpdateProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextCourierProfile } from 'app/state/courier/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { AppVersionLabel } from 'common/components/backoffice/AppVersionLabel';
import {
  getEditableProfile,
  modePTOptions,
  situationPTOptions,
} from 'pages/backoffice/utils';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { MdThumbDownOffAlt, MdThumbUpOffAlt } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { useRouteMatch } from 'react-router';
import { useLocation } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

const withoutActionPages = ['location', 'orders', 'iugu', 'reviews'];

interface BaseDrawerProps {
  staff: { id: string | undefined; name: string };
  isOpen: boolean;
  onClose(): void;
  children: React.ReactNode | React.ReactNode[];
}

export const CourierBaseDrawer = ({
  staff,
  onClose,
  children,
  ...props
}: BaseDrawerProps) => {
  //context
  const { userAbility } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const queryClient = useQueryClient();
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const { deleteAccount, deleteAccountResult } = useAuthentication();
  const {
    courier,
    updatedOn,
    isEditingEmail,
    setIsEditingEmail,
    contextValidation,
    selfieFiles,
    setSelfieFiles,
    documentFiles,
    setDocumentFiles,
  } = useContextCourierProfile();
  const { updateProfile, updateResult } = useCourierUpdateProfile(courier?.id);
  const { isLoading } = updateResult;

  // state
  const [isDeleting, setIsDeleting] = React.useState(false);

  // helpers
  const pageName = pathname.split('/').pop();
  const pageHasAction = pageName
    ? !withoutActionPages.includes(pageName)
    : true;
  const situationAlert =
    courier?.situation === 'rejected' || courier?.situation === 'invalid';
  const city =
    courier?.city && courier?.state
      ? `${courier?.city} - ${courier?.state}`
      : 'N/I';
  //handlers
  let courierName = courier?.name ?? 'N/I';
  if (courier?.surname) courierName += ` ${courier.surname}`;

  //handlers
  const handleSave = () => {
    if (courier?.situation === 'approved') {
      if (!contextValidation.cpf)
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'courier-base-drawer-valid-cpf',
          message: {
            title:
              contextValidation.message ??
              'O CPF não foi informado ou não é válido.',
          },
        });
      if (!contextValidation.cnpj)
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'courier-base-drawer-valid-cnpj',
          message: {
            title:
              contextValidation.message ?? 'O CNPJ informado não é válido.',
          },
        });
      if (!contextValidation.agency)
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'courier-base-drawer-valid-agency',
          message: {
            title:
              contextValidation.message ?? 'A agência informada não é válida.',
          },
        });
      if (!contextValidation.account)
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'courier-base-drawer-valid-account',
          message: {
            title:
              contextValidation.message ?? 'A conta informada não é válida.',
          },
        });
    }
    setIsEditingEmail(false);
    const changes = getEditableProfile(
      courier,
      isEditingEmail
    ) as Partial<CourierProfile>;
    const selfieFileToSave = selfieFiles ? selfieFiles[0] : null;
    const documentFileToSave = documentFiles ? documentFiles[0] : null;
    updateProfile({ changes, selfieFileToSave, documentFileToSave });
    if (selfieFileToSave)
      queryClient.invalidateQueries(['courier:selfie', courier?.id]);
    if (documentFileToSave)
      queryClient.invalidateQueries(['courier:document', courier?.id]);
    setSelfieFiles(null);
    setDocumentFiles(null);
  };

  const handleDeleteAccount = () => {
    if (!courier?.id) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'courier-base-drawer-valid-no-user-id',
        message: { title: 'Não foi possível encontrar o id deste usuário.' },
      });
    } else {
      deleteAccount({ accountId: courier.id });
    }
  };

  // side effects
  React.useEffect(() => {
    if (deleteAccountResult.isSuccess) onClose();
  }, [deleteAccountResult.isSuccess, onClose]);

  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent mt={{ base: '16', lg: '0' }}>
          <DrawerCloseButton
            bg="green.500"
            mr="12px"
            _focus={{ outline: 'none' }}
          />
          <DrawerHeader pb="2">
            <Text
              color="black"
              fontSize="2xl"
              fontWeight="700"
              lineHeight="28px"
              mb="2"
            >
              {courier?.code ?? 'N/E'}
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Data do onboarding:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(courier?.createdOn)}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(updatedOn)}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Versão do app:')}{' '}
              <AppVersionLabel type="courier" version={courier?.appVersion} />
            </Text>
            {/*<Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Agente responsável:')}{' '}
              <Text as="span" fontWeight="500">
                *
              </Text>
            </Text>*/}
          </DrawerHeader>
          <DrawerBody pb="28">
            <SectionTitle mt="0">{courierName}</SectionTitle>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Cidade:')}{' '}
              <Text as="span" fontWeight="500">
                {city}
              </Text>
            </Text>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Status:')}{' '}
              <Text
                as="span"
                fontWeight="500"
                color={situationAlert ? 'red' : 'black'}
              >
                {courier?.situation
                  ? situationPTOptions[courier?.situation]
                  : 'N/E'}
              </Text>
            </Text>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Método de entrega principal:')}{' '}
              <Text as="span" fontWeight="500">
                {courier?.mode ? modePTOptions[courier.mode] : 'N/I'}
              </Text>
            </Text>
            <Flex mt="1" alignItems="flex-end">
              <Text
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Nº de pedidos:')}
              </Text>
              <Text ml="3" as="span" fontWeight="500">
                {`entregues (${courier?.statistics?.deliveries ?? 'N/E'})`}
              </Text>
              <Text ml="2" as="span" fontWeight="500">
                {`rejeitados (${courier?.statistics?.rejected ?? 'N/E'})`}
              </Text>
              <Text ml="2" as="span" fontWeight="500">
                {`liberados (${courier?.statistics?.canceled ?? 'N/E'})`}
              </Text>
            </Flex>
            <Flex mt="1" alignItems="flex-end">
              <Text
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Avaliações:')}
              </Text>
              <Text ml="3" as="span" fontWeight="500" color="green.600">
                <Icon mr="1" as={MdThumbUpOffAlt} />(
                {courier?.statistics?.positiveReviews ?? 0})
              </Text>
              <Text ml="4" as="span" fontWeight="500" color="red">
                <Icon mr="1" as={MdThumbDownOffAlt} />(
                {courier?.statistics?.negativeReviews ?? 0})
              </Text>
            </Flex>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Live:')}{' '}
              <Text as="span" fontWeight="500">
                <Icon
                  mt="-2px"
                  viewBox="0 0 200 200"
                  color={courier?.status === 'available' ? 'green.500' : 'red'}
                >
                  <path
                    fill="currentColor"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                  />
                </Icon>
              </Text>
            </Text>
            <Flex
              my="8"
              fontSize="lg"
              flexDir="row"
              alignItems="flex-start"
              borderBottom="1px solid #C8D7CB"
              overflowX="auto"
            >
              <DrawerLink px="2" to={`${url}`} label={t('Cadastro')} />
              <DrawerLink px="2" to={`${url}/status`} label={t('Status')} />
              {courier?.situation === 'approved' && (
                <DrawerLink
                  px="2"
                  to={`${url}/location`}
                  label={t('Localização')}
                />
              )}
              {(courier?.situation === 'approved' ||
                courier?.situation === 'blocked') && (
                <DrawerLink px="2" to={`${url}/orders`} label={t('Pedidos')} />
              )}
              {(courier?.situation === 'approved' ||
                courier?.situation === 'blocked') && (
                <DrawerLink px="2" to={`${url}/iugu`} label={t('Iugu')} />
              )}
              {(courier?.situation === 'approved' ||
                courier?.situation === 'blocked') && (
                <DrawerLink
                  px="2"
                  to={`${url}/reviews`}
                  label={t('Avaliações')}
                />
              )}
            </Flex>
            {children}
          </DrawerBody>
          <DrawerFooter
            display={userAbility?.can('update', 'couriers') ? 'flex' : 'none'}
            borderTop="1px solid #F2F6EA"
          >
            {isDeleting ? (
              <Box
                mt="8"
                w="100%"
                bg="#FFF8F8"
                border="1px solid red"
                borderRadius="lg"
                p="6"
              >
                <Text color="red">
                  {t(`Tem certeza que deseja excluir esta conta?`)}
                </Text>
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
              <HStack
                w="100%"
                spacing={4}
                justifyContent={pageHasAction ? 'flex-start' : 'flex-end'}
              >
                <Button
                  display={pageHasAction ? 'inline-flex' : 'none'}
                  width="49%"
                  fontSize="15px"
                  onClick={handleSave}
                  isLoading={isLoading}
                  loadingText={t('Salvando')}
                >
                  {t('Salvar alterações')}
                </Button>
                <Button
                  width="49%"
                  fontSize="15px"
                  variant="dangerLight"
                  onClick={() => setIsDeleting(true)}
                >
                  {t('Excluir conta')}
                </Button>
              </HStack>
            )}
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
