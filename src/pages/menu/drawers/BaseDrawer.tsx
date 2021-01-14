import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import React from 'react';

interface BaseDrawerProps {
  title: string;
  isOpen: boolean;
  onClose(): void;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<FocusableElement>;
}

export const BaseDrawer = ({ title, onClose, children, ...props }: BaseDrawerProps) => {
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{title}</DrawerHeader>
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
