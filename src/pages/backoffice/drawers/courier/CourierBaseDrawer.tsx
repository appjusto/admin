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
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useCourierUpdateProfile } from 'app/api/courier/useCourierUpdateProfile';
import { useContextCourierProfile } from 'app/state/courier/context';
import { CourierProfile } from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { modePTOptions, situationPTOptions } from 'pages/backoffice/utils';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { queryCache } from 'react-query';
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

export const CourierBaseDrawer = ({ agent, onClose, children, ...props }: BaseDrawerProps) => {
  //context
  const { url } = useRouteMatch();
  const {
    courier,
    contextValidation,
    selfieFiles,
    setSelfieFiles,
    documentFiles,
    setDocumentFiles,
  } = useContextCourierProfile();
  const { updateProfile, updateResult } = useCourierUpdateProfile();
  const { isLoading, isSuccess, isError, error: updateError } = updateResult;

  // state
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);

  // helpers
  const situationAlert = courier?.situation === 'rejected' || courier?.situation === 'invalid';

  //handlers
  let courierName = courier?.name ?? 'N/I';
  if (courier?.surname) courierName += ` ${courier.surname}`;

  //handlers
  const handleSave = () => {
    setError(initialError);
    submission.current += 1;
    if (courier?.situation === 'approved') {
      if (!contextValidation.cpf)
        return setError({
          status: true,
          error: null,
          message: { title: 'O CPF não foi informado ou não é válido.' },
        });
      if (!contextValidation.cnpj)
        return setError({
          status: true,
          error: null,
          message: { title: 'O CNPJ informado não é válido.' },
        });
      if (!contextValidation.agency)
        return setError({
          status: true,
          error: null,
          message: { title: 'A agência informada não é válida.' },
        });
      if (!contextValidation.account)
        return setError({
          status: true,
          error: null,
          message: { title: 'A conta informada não é válida.' },
        });
    }
    const newState = {} as CourierProfile;
    courier &&
      Object.keys(courier).forEach((key) => {
        //@ts-ignore
        if (courier[key]) newState[key] = courier[key];
      });
    const selfieFileToSave = selfieFiles ? selfieFiles[0] : null;
    const documentFileToSave = documentFiles ? documentFiles[0] : null;
    updateProfile({ changes: newState, selfieFileToSave, documentFileToSave });
    if (selfieFileToSave) queryCache.invalidateQueries(['courier:selfie', courier?.id]);
    if (documentFileToSave) queryCache.invalidateQueries(['courier:document', courier?.id]);
    setSelfieFiles(null);
    setDocumentFiles(null);
  };

  // side effects
  React.useEffect(() => {
    if (isError)
      setError({
        status: true,
        error: updateError,
      });
  }, [isError, updateError]);

  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {courier?.code ?? 'N/E'}
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Data do onboarding:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(courier?.createdOn)}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(courier?.updatedOn)}
              </Text>
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
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Cidade:')}{' '}
              <Text as="span" fontWeight="500" color={situationAlert ? 'red' : 'black'}>
                {`${courier?.company?.city ?? 'N/I'} - ${courier?.company?.state ?? 'N/I'}`}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500" color={situationAlert ? 'red' : 'black'}>
                {courier?.situation ? situationPTOptions[courier?.situation] : 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Método de entrega principal:')}{' '}
              <Text as="span" fontWeight="500">
                {courier?.mode ? modePTOptions[courier.mode] : 'N/I'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
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
              height="38px"
              borderBottom="1px solid #C8D7CB"
            >
              <DrawerLink to={`${url}`} label={t('Cadastro')} />
              <DrawerLink to={`${url}/status`} label={t('Status')} />
              {courier?.situation === 'approved' && (
                <DrawerLink to={`${url}/location`} label={t('Localização')} />
              )}
              {(courier?.situation === 'approved' || courier?.situation === 'blocked') && (
                <DrawerLink to={`${url}/orders`} label={t('Pedidos')} />
              )}
              {(courier?.situation === 'approved' || courier?.situation === 'blocked') && (
                <DrawerLink to={`${url}/iugu`} label={t('Iugu')} />
              )}
            </Flex>
            {children}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <HStack w="full" spacing={4}>
              <Button
                width="full"
                maxW="240px"
                fontSize="15px"
                onClick={handleSave}
                isLoading={isLoading}
                loadingText={t('Salvando')}
              >
                {t('Salvar alterações')}
              </Button>
              <SuccessAndErrorHandler
                submission={submission.current}
                isSuccess={isSuccess}
                isError={error.status}
                error={error.error}
                errorMessage={error.message}
              />
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
