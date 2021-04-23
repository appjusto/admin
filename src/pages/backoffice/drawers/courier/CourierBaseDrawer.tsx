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
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { modePTOptions } from 'pages/backoffice/utils';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
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

type Status = 'unsubmited' | 'success' | 'error';
type SubmitStatus = { status: Status; message: string };

const initialStatus = { status: 'unsubmited', message: '' } as SubmitStatus;

export const CourierBaseDrawer = ({ agent, onClose, children, ...props }: BaseDrawerProps) => {
  //context
  const { url } = useRouteMatch();
  const { courier, contextValidation } = useContextCourierProfile();
  const { updateProfile, updateResult } = useCourierUpdateProfile();
  const { isLoading, isSuccess, isError } = updateResult;

  // state
  const [submitStatus, setSubmitStatus] = React.useState<SubmitStatus>(initialStatus);

  //handlers
  let courierName = courier?.name ?? 'N/I';
  if (courier?.surname) courierName += ` ${courier.surname}`;

  //handlers
  const handleSave = () => {
    setSubmitStatus(initialStatus);
    if (
      !contextValidation.cpf ||
      !contextValidation.cnpj ||
      !contextValidation.agency ||
      !contextValidation.account
    ) {
      return setSubmitStatus({
        status: 'error',
        message: 'Verificar o preenchimento dos campos',
      });
    }
    updateProfile({
      name: courier?.name,
      surname: courier?.surname,
      phone: courier?.phone,
      cpf: courier?.cpf,
      company: courier?.company,
      bankAccount: courier?.bankAccount,
    });
  };

  // side effects
  React.useEffect(() => {
    if (isSuccess) setSubmitStatus({ status: 'success', message: 'Informações salvas!' });
    if (isError)
      setSubmitStatus({ status: 'error', message: 'Não foi possível acessar o servidor' });
  }, [isError, isSuccess]);

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
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Data do onboarding:')}{' '}
              <Text as="span" fontWeight="500">
                {courier?.createdOn
                  ? getDateAndHour(courier.createdOn as firebase.firestore.Timestamp)
                  : ''}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {courier?.updatedOn
                  ? getDateAndHour(courier.updatedOn as firebase.firestore.Timestamp)
                  : ''}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Agente responsável:')}{' '}
              <Text as="span" fontWeight="500">
                {agent?.name} *
              </Text>
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <SectionTitle>{courierName}</SectionTitle>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {courier?.situation === 'approved' ? t('Ativo') : t('Inativo')}
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
                <Icon mt="-2px" viewBox="0 0 200 200" color={courier?.status ? 'green.500' : 'red'}>
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
            </Flex>
            {children}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <HStack w="full" spacing={4}>
              <Button
                type="submit"
                width="full"
                maxW="240px"
                fontSize="15px"
                onClick={handleSave}
                isLoading={isLoading}
                loadingText={t('Salvando')}
              >
                {t('Salvar alterações')}
              </Button>
              {submitStatus.status === 'success' && (
                <AlertSuccess mt="0" h="48px" description={submitStatus.message} />
              )}
              {submitStatus.status === 'error' && (
                <AlertError mt="0" h="48px" description={submitStatus.message} />
              )}
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
