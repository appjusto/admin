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
  Icon,
  Text,
} from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { isObject } from 'lodash';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { situationPTOptions } from '../../utils';

interface BaseDrawerProps {
  agent: { id: string | undefined; name: string };
  isOpen: boolean;
  onClose(): void;
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessBaseDrawer = ({ agent, onClose, children, ...props }: BaseDrawerProps) => {
  //context
  const { url } = useRouteMatch();
  const { business, manager, handleSave, isLoading, marketPlace } = useContextBusinessBackoffice();
  // helpers
  const isMarketplace = isObject(marketPlace);
  const situationAlert = business?.situation === 'rejected' || business?.situation === 'invalid';
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent mt={{ base: '16', md: '0' }}>
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
                {business?.code ?? 'N/E'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Data do onboarding:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(business?.createdOn)}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(business?.updatedOn)}
              </Text>
            </Text>
            {/*<Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Agente responsável:')}{' '}
              <Text as="span" fontWeight="500">
                *
              </Text>
              </Text>*/}
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Nome do administrador:')}{' '}
              <Text as="span" fontWeight="500">
                {manager?.name ?? 'N/E'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500" color={situationAlert ? 'red' : 'black'}>
                {business?.situation ? situationPTOptions[business?.situation] : 'N/E'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Etapa:')}{' '}
              <Text as="span" fontWeight="500">
                {business?.onboarding === 'completed'
                  ? t('Concluído')
                  : t(`onboarding - ${business?.onboarding}`)}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
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
              borderBottom="1px solid #C8D7CB"
              overflowX="auto"
            >
              <DrawerLink to={`${url}`} label={t('Cadastro')} />
              {business?.situation === 'approved' && (
                <DrawerLink to={`${url}/live`} label={t('Live')} />
              )}
              <DrawerLink to={`${url}/status`} label={t('Status')} />
              {isMarketplace && <DrawerLink to={`${url}/iugu`} label={t('Iugu')} />}
            </Flex>
            {children}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <Flex w="full" flexDir="row" justifyContent="space-between">
              <Button
                width="full"
                maxW={{ base: '160px', md: '240px' }}
                fontSize={{ base: '13px', md: '15px' }}
                onClick={handleSave}
                isLoading={isLoading}
                loadingText={t('Salvando')}
              >
                {t('Salvar alterações')}
              </Button>
              <CustomButton
                id="personification"
                mt="0"
                width="full"
                maxW={{ base: '160px', md: '240px' }}
                fontSize={{ base: '13px', md: '15px' }}
                variant="secondary"
                label={t('Personificar restaurante')}
                link={'/app'}
              />
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
