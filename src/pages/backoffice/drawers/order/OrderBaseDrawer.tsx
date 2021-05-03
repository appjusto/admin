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
  Text,
} from '@chakra-ui/react';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  agent: { id: string | undefined; name: string };
  isOpen: boolean;
  onClose(): void;
  children: React.ReactNode | React.ReactNode[];
}

type Status = 'unsubmited' | 'success' | 'error';
type SubmitStatus = { status: Status; message: string };

const initialStatus = { status: 'unsubmited', message: '' } as SubmitStatus;

export const OrderBaseDrawer = ({ agent, onClose, children, ...props }: BaseDrawerProps) => {
  //context
  const { url } = useRouteMatch();

  // state
  const [submitStatus, setSubmitStatus] = React.useState<SubmitStatus>(initialStatus);

  //handlers

  //handlers

  // side effects

  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {'CODE' ?? 'N/E'}
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Pedido feito em:')}{' '}
              {/*<Text as="span" fontWeight="500">
                {consumer?.createdOn
                  ? getDateAndHour(consumer.createdOn as firebase.firestore.Timestamp)
                  : ''}
                </Text>*/}
              <Text as="span" fontWeight="500">
                27/04/2021 - 00:00
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                27/04/2021 - 00:00
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Nome do cliente:')}{' '}
              <Text as="span" fontWeight="500">
                Caetano Veloso
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
            <Flex
              my="8"
              fontSize="lg"
              flexDir="row"
              alignItems="flex-start"
              height="38px"
              borderBottom="1px solid #C8D7CB"
            >
              <DrawerLink to={`${url}`} label={t('Participantes')} />
              <DrawerLink to={`${url}/order`} label={t('Pedidos')} />
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
                //onClick={handleSave}
                //isLoading={isLoading}
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
