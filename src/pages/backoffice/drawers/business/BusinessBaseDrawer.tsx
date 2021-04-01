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
  Text,
} from '@chakra-ui/react';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { t } from 'utils/i18n';
import { SectionTitle } from '../SectionTitle';

interface BaseDrawerProps {
  agent: { id: string; name: string };
  businessId: string;
  businessName: string;
  createdOn: string;
  updatedOn: string;
  managerName: string;
  isOpen: boolean;
  onClose(): void;
  children: React.ReactNode;
}

export const BusinessBaseDrawer = ({
  agent,
  businessId,
  businessName,
  createdOn,
  updatedOn,
  managerName,
  onClose,
  children,
  ...props
}: BaseDrawerProps) => {
  //context
  const { url } = useRouteMatch();
  //handlers

  //UI conditions

  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader borderBottom="1px solid #C8D7CB" pb="0" mb="8">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {businessName}
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Data do onboarding:')}{' '}
              <Text as="span" fontWeight="500">
                {createdOn}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {updatedOn}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Agente responsável:')}{' '}
              <Text as="span" fontWeight="500">
                {agent?.name}
              </Text>
            </Text>
            <SectionTitle>{t('Geral')}</SectionTitle>
            <Text mt="4" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Nome do administrador:')}{' '}
              <Text as="span" fontWeight="500">
                {managerName}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {'Ativo'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Etapa:')}{' '}
              <Text as="span" fontWeight="500">
                {'Concluído'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Live:')}{' '}
              <Text as="span" fontWeight="500">
                {''}
              </Text>
            </Text>
            <Flex mt="8" fontSize="lg" flexDir="row" alignItems="flex-start" height="38px">
              <DrawerLink to={`${url}`} label={t('Cadastro')} />
              <DrawerLink to={`${url}/live`} label={t('Live')} />
              <DrawerLink to={`${url}/status`} label={t('Status')} />
            </Flex>
          </DrawerHeader>
          <DrawerBody pb="28">{children}</DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <Flex w="full" justifyContent="flex-start">
              <Flex w="full" maxW="607px" flexDir="row" justifyContent="space-between">
                <Button type="submit" width="full" maxW="240px" fontSize="15px" onClick={() => {}}>
                  {t('Salvar alterações')}
                </Button>
                <Button width="full" maxW="240px" variant="grey" onClick={() => {}}>
                  {t('Personificar restaurante')}
                </Button>
              </Flex>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
