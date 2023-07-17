import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Text,
} from '@chakra-ui/react';
import { useContextStaffProfile } from 'app/state/staff/context';
import React from 'react';

interface BaseDrawerProps {
  title: string;
  isOpen: boolean;
  onClose(): void;
  onSubmitHandler(): void;
  footer(): React.ReactNode;
  children: React.ReactNode;
}

export const BaseDrawer = ({
  title,
  onClose,
  onSubmitHandler,
  footer,
  children,
  ...props
}: BaseDrawerProps) => {
  // context
  const { isBackofficeUser } = useContextStaffProfile();
  // UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            onSubmitHandler();
          }}
        >
          <DrawerContent
            mt={{ base: '16', lg: '0' }}
            pt={isBackofficeUser ? '20' : 0}
          >
            <DrawerCloseButton />
            <DrawerHeader pb="4">
              <Text fontSize="2xl" fontWeight="700">
                {title}
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28">{children}</DrawerBody>
            <DrawerFooter>{footer()}</DrawerFooter>
          </DrawerContent>
        </form>
      </DrawerOverlay>
    </Drawer>
  );
};
