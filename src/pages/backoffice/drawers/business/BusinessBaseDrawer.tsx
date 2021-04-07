import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { Business, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  agent: { id: string | undefined; name: string };
  business: WithId<Business> | null | undefined;
  managerName: string;
  isOpen: boolean;
  onClose(): void;
  //onSave?(): void;
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessBaseDrawer = ({
  agent,
  business,
  managerName,
  onClose,
  //onSave,
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
          <DrawerHeader pb="0">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {business?.name ?? 'Não foi possível carregar o nome'}
            </Text>
          </DrawerHeader>
          <DrawerBody pt="2" pb="28">
            <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('ID:')}{' '}
              <Text as="span" fontWeight="500">
                {business?.id ?? 'Não foi possível carregar o id'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Data do onboarding:')}{' '}
              <Text as="span" fontWeight="500">
                {business?.createdOn
                  ? getDateAndHour(business.createdOn as firebase.firestore.Timestamp)
                  : ''}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {business?.updatedOn
                  ? getDateAndHour(business.updatedOn as firebase.firestore.Timestamp)
                  : ''}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Agente responsável:')}{' '}
              <Text as="span" fontWeight="500">
                {agent?.name}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Nome do administrador:')}{' '}
              <Text as="span" fontWeight="500">
                {managerName}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {business?.situation === 'approved' ? t('Ativo') : t('Inativo')}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Etapa:')}{' '}
              <Text as="span" fontWeight="500">
                {business?.onboarding === 'completed'
                  ? t('Concluído')
                  : t(`onboarding - ${business?.onboarding}`)}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Live:')}{' '}
              <Text as="span" fontWeight="500">
                <Icon
                  mt="-2px"
                  viewBox="0 0 200 200"
                  color={business?.enabled ? 'green.500' : 'red'}
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
              <DrawerLink to={`${url}/live`} label={t('Live')} />
              <DrawerLink to={`${url}/status`} label={t('Status')} />
            </Flex>
            {children}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <Flex w="full" justifyContent="flex-start">
              <Flex w="full" maxW="607px" flexDir="row" justifyContent="flex-end">
                {/*<Button type="submit" width="full" maxW="240px" fontSize="15px" onClick={onSave}>
                  {t('Salvar alterações')}
                </Button>*/}
                <CustomButton
                  id="personification"
                  mt="0"
                  width="full"
                  maxW="240px"
                  variant="grey"
                  label={t('Personificar restaurante')}
                  link={'/app'}
                />
              </Flex>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
