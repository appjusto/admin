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
import React from 'react';

interface BaseDrawerProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose(): void;
  isReviewing?: boolean;
  children: React.ReactNode | React.ReactNode[];
  footer?: React.ReactNode | React.ReactNode[];
}

export const FinancesBaseDrawer = ({
  title,
  description,
  onClose,
  isReviewing,
  children,
  footer,
  ...props
}: BaseDrawerProps) => {
  // refs
  const bodyRef = React.useRef<HTMLDivElement>(null);
  // side effects
  React.useEffect(() => {
    if (!bodyRef.current) return;
    if (isReviewing) bodyRef.current.scroll({ top: 0, behavior: 'smooth' });
  }, [isReviewing]);
  // UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent pt={{ base: '76px', md: '0' }}>
          <DrawerCloseButton mt={{ base: '80px', md: '0' }} />
          <DrawerHeader>
            <Text fontSize="2xl" fontWeight="700">
              {title}
            </Text>
            {description && (
              <Text mt="6" fontSize="16px" fontWeight="500" lineHeight="22px">
                {description}
              </Text>
            )}
          </DrawerHeader>
          <DrawerBody ref={bodyRef} pb="28">
            {children}
          </DrawerBody>
          {footer && <DrawerFooter borderTop="1px solid #F2F6EA">{footer}</DrawerFooter>}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
