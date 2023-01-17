import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { getFirebaseErrorMessage } from 'core/fb';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { DrawerLink } from './DrawerLink';

interface BaseDrawerProps {
  type: string;
  title: string;
  isOpen: boolean;
  isError?: boolean;
  error?: unknown | string | null;
  headerMd?: string;
  onClose(): void;
  children: React.ReactNode;
}

export const BaseDrawer = ({
  type,
  title,
  isError,
  error,
  headerMd,
  onClose,
  children,
  ...props
}: BaseDrawerProps) => {
  // context
  const { url } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  // UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent
          mt={{ base: '16', lg: '0' }}
          pt={isBackofficeUser ? '20' : 0}
        >
          <DrawerCloseButton />
          <DrawerHeader
            borderBottom={type === 'product' ? '1px solid #C8D7CB' : 'none'}
            pb="0"
            mb={headerMd ? headerMd : '8'}
          >
            <Text fontSize="2xl" fontWeight="700">
              {title}
            </Text>
            {type === 'product' && (
              <Flex
                fontSize="sm"
                mt="4"
                flexDir="row"
                alignItems="flex-start"
                //height="38px"
                overflowX="auto"
              >
                <DrawerLink to={`${url}`} label="Detalhes" />
                <DrawerLink
                  to={`${url}/complements`}
                  label="Complementos"
                  isDisabled={url.includes('new')}
                />
                <DrawerLink
                  to={`${url}/availability`}
                  label="Disponibilidade"
                  isDisabled={url.includes('new')}
                />
              </Flex>
            )}
          </DrawerHeader>
          <DrawerBody pb="28">
            {children}
            {isError && (
              <Box mt="6">
                {isError && (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>{t('Erro!')}</AlertTitle>
                    <AlertDescription>
                      {getFirebaseErrorMessage(error) ?? t('Tenta de novo?')}
                    </AlertDescription>
                  </Alert>
                )}
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
