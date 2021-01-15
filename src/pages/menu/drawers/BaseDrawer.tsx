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
import { t } from 'utils/i18n';
import { DrawerButtons } from './DrawerButtons';

interface BaseDrawerProps {
  type: string;
  productPage?: string;
  title: string;
  isOpen: boolean;
  isEditing: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown | string | null;
  setProductPage?: (value: string) => void;
  onSave(): void;
  onClose(): void;
  onDelete(): void;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<FocusableElement>;
}

export const BaseDrawer = ({
  type,
  productPage = 'detail',
  title,
  isEditing,
  isLoading,
  isError,
  error,
  setProductPage,
  onSave,
  onClose,
  onDelete,
  children,
  ...props
}: BaseDrawerProps) => {
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom={type === 'product' ? '1px solid #C8D7CB' : 'none'} pb="0">
            <Text>{title}</Text>
            {type === 'product' && (
              <Flex fontSize="sm" mt="4" flexDir="row" alignItems="flex-start" height="34px">
                <Link
                  pb="2"
                  px="4"
                  mr="4"
                  _hover={{ textDecor: 'none' }}
                  borderBottom={productPage === 'detail' ? '4px solid #78E08F' : 'none'}
                  onClick={() => setProductPage && setProductPage('detail')}
                >
                  Detalhes
                </Link>
                <Link
                  pb="2"
                  px="4"
                  _hover={{ textDecor: 'none' }}
                  borderBottom={productPage === 'complements' ? '4px solid #78E08F' : 'none'}
                  onClick={() => setProductPage && setProductPage('complements')}
                >
                  Complementos
                </Link>
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
              <DrawerButtons
                type={type}
                isEditing={isEditing}
                onDelete={onDelete}
                isLoading={isLoading}
              />
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
