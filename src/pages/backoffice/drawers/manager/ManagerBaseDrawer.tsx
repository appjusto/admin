import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useManager } from 'app/api/manager/useManager';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import { situationPTOptions } from 'pages/backoffice/utils';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { ManagerForm } from './ManagerForm';

const FetchingHeader = () => {
  return (
    <DrawerHeader pb="2">
      <Text
        color="black"
        fontSize="2xl"
        fontWeight="700"
        lineHeight="28px"
        mb="2"
      >
        {t('Colaborador')}
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Criado em:')} <Skeleton as="span" maxW="100px" />
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Atualizado em:')} <Skeleton as="span" maxW="100px" />
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Senha ativa:')} <Skeleton as="span" maxW="100px" />
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Situação:')} <Skeleton as="span" maxW="100px" />
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Versão mobile:')} <Skeleton as="span" maxW="100px" />
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Versão web:')} <Skeleton as="span" maxW="100px" />
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Último restaurante acessado:')} <Skeleton as="span" maxW="100px" />
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Info. do navegador:')} <Skeleton as="span" maxW="100px" />
      </Text>
    </DrawerHeader>
  );
};

const ManagerNotFoundHeader = () => {
  return (
    <DrawerHeader pb="2">
      <Text
        color="black"
        fontSize="2xl"
        fontWeight="700"
        lineHeight="28px"
        mb="2"
      >
        {t('Colaborador não encontrado')}
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Criado em:')}{' '}
        <Text as="span" fontWeight="500">
          N/E
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
          N/E
        </Text>
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Senha ativa:')}{' '}
        <Text as="span" fontWeight="500">
          N/E
        </Text>
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Situação:')}{' '}
        <Text as="span" fontWeight="500">
          N/E
        </Text>
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Versão mobile:')}{' '}
        <Text as="span" fontWeight="500">
          N/E
        </Text>
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Versão web:')}{' '}
        <Text as="span" fontWeight="500">
          N/E
        </Text>
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Último restaurante acessado:')}{' '}
        <Text as="span" fontWeight="500">
          N/E
        </Text>
      </Text>
      <Text
        mt="1"
        fontSize="15px"
        color="black"
        fontWeight="700"
        lineHeight="22px"
      >
        {t('Info. do navegador:')}{' '}
        <Text as="span" fontWeight="500">
          N/E
        </Text>
      </Text>
    </DrawerHeader>
  );
};

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  managerId: string;
};

const ManagerBaseDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { goBack } = useHistory();
  const { managerId } = useParams<Params>();
  const { manager } = useManager(managerId);
  const { updateProfile, updateResult } = useUpdateManagerProfile(managerId);
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent mt={{ base: '16', lg: '0' }}>
          <Box pt="2" px="6">
            <IconButton
              size="sm"
              variant="outline"
              title={t('Voltar')}
              aria-label="voltar-para-restaurante"
              _focus={{ outline: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={goBack}
            />
          </Box>
          <DrawerCloseButton
            bg="green.500"
            mr="12px"
            _focus={{ outline: 'none' }}
          />
          {manager === undefined ? (
            <FetchingHeader />
          ) : manager === null ? (
            <ManagerNotFoundHeader />
          ) : (
            <DrawerHeader pb="2">
              <Text
                color="black"
                fontSize="2xl"
                fontWeight="700"
                lineHeight="28px"
                mb="2"
              >
                {t('Colaborador')}
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Criado em:')}{' '}
                <Text as="span" fontWeight="500">
                  {getDateAndHour(manager.createdOn)}
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
                  {getDateAndHour(manager.updatedOn)}
                </Text>
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Senha ativa:')}{' '}
                <Text as="span" fontWeight="500">
                  {manager.isPasswordActive ? t('Sim') : t('Não')}
                </Text>
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Situação:')}{' '}
                <Text as="span" fontWeight="500">
                  {situationPTOptions[manager.situation] ?? 'N/E'}
                </Text>
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Versão mobile:')}{' '}
                <Text as="span" fontWeight="500">
                  {manager.appVersion ?? 'N/E'}
                </Text>
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Versão web:')}{' '}
                <Text as="span" fontWeight="500">
                  {manager.webAppVersion ?? 'N/E'}
                </Text>
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Versão desktop:')}{' '}
                <Text as="span" fontWeight="500">
                  {manager.desktopAppVersion ?? 'N/E'}
                </Text>
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Último restaurante acessado:')}{' '}
                <Text as="span" fontWeight="500">
                  {manager.lastBusinessId ?? 'N/E'}
                </Text>
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Info. do navegador:')}{' '}
                <Text as="span" fontWeight="500">
                  {manager.userAgent ?? 'N/E'}
                </Text>
              </Text>
            </DrawerHeader>
          )}
          <DrawerBody position="relative">
            <ManagerForm
              manager={manager}
              updateManager={(changes) => updateProfile({ changes })}
              isLoading={updateResult.isLoading}
            />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default ManagerBaseDrawer;
