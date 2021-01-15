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
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import { getErrorMessage } from 'core/fb';
import React, { FormEvent } from 'react';
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
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{title}</DrawerHeader>
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
