import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import React from 'react';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  title: string;
  isOpen: boolean;
  onSave(): void;
  onClose(): void;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<FocusableElement>;
}

export const BaseDrawer = ({ title, children, onSave, onClose, ...props }: BaseDrawerProps) => {
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{title}</DrawerHeader>

          <DrawerBody>{children}</DrawerBody>

          <DrawerFooter>
            <Button width="full" color="blue" onClick={onSave}>
              {t('Salvar')}
            </Button>
            <Button width="full" variant="outline" ml={3} onClick={onClose}>
              {t('Cancelar')}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
