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
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { t } from 'utils/i18n';

interface HubsterDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const HubsterDrawer = ({ onClose, ...props }: HubsterDrawerProps) => {
  // context
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  // helpers
  // side effects
  // UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent pt={{ base: '76px', md: isBackofficeUser ? '16' : '0' }}>
          <DrawerCloseButton mt={{ base: '80px', md: '0' }} />
          <DrawerHeader>
            <Text fontSize="2xl" fontWeight="700">
              {t('Integrar com o Hubster')}
            </Text>
          </DrawerHeader>
          <DrawerBody></DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA"></DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
