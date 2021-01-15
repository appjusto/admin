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
  Link,
  Text,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import { getErrorMessage } from 'core/fb';
import React, { FormEvent } from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { DrawerButtons } from './DrawerButtons';

interface BaseDrawerProps {
  type: string;
  title: string;
  isOpen: boolean;
  isEditing: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown | string | null;
  onSave(): void;
  onClose(): void;
  onDelete(): void;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<FocusableElement>;
}

interface LinkProps {
  to: string;
  label: string;
}

const DrawerLink = ({ to, label }: LinkProps) => {
  let match = useRouteMatch({
    path: to,
    exact: to.includes('complements') ? false : true,
  });
  return (
    <Link
      as={RouterLink}
      to={to}
      pb="2"
      px="4"
      mr="4"
      fontSize="lg"
      fontWeight="500"
      _hover={{ textDecor: 'none' }}
      _focus={{ boxShadow: 'none' }}
      borderBottom={match ? '4px solid #78E08F' : 'none'}
    >
      {label}
    </Link>
  );
};

export const BaseDrawer = ({
  type,
  title,
  isEditing,
  isLoading,
  isError,
  error,
  onSave,
  onClose,
  onDelete,
  children,
  ...props
}: BaseDrawerProps) => {
  const { url } = useRouteMatch();
  let isComplements = useRouteMatch({
    path: `${url}/complements`,
    exact: false,
  });
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            borderBottom={type === 'product' ? '1px solid #C8D7CB' : 'none'}
            pb="0"
            mb="8"
          >
            <Text fontSize="2xl" fontWeight="700">
              {title}
            </Text>
            {type === 'product' && (
              <Flex fontSize="sm" mt="4" flexDir="row" alignItems="flex-start" height="38px">
                <DrawerLink to={`${url}`} label="Detalhes" />
                <DrawerLink to={`${url}/complements`} label="Complementos" />
              </Flex>
            )}
          </DrawerHeader>
          <DrawerBody pb="28">
            <form
              onSubmit={(ev: FormEvent) => {
                ev.preventDefault();
                onSave();
              }}
            >
              {children}
              {!isComplements && (
                <DrawerButtons
                  type={type}
                  isEditing={isEditing}
                  onDelete={onDelete}
                  isLoading={isLoading}
                />
              )}
              {isError && (
                <Box mt="6">
                  {isError && (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertTitle mr={2}>{t('Erro!')}</AlertTitle>
                      <AlertDescription>
                        {getErrorMessage(error) ?? t('Tenta de novo?')}
                      </AlertDescription>
                    </Alert>
                  )}
                </Box>
              )}
            </form>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
