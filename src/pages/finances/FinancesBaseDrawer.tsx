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
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose(): void;
  isReviewing: boolean;
  setIsReviewing(value: boolean): void;
  pimaryFunc?(): void;
  children: React.ReactNode;
}

export const FinancesBaseDrawer = ({
  title,
  description,
  onClose,
  isReviewing,
  setIsReviewing,
  pimaryFunc,
  children,
  ...props
}: BaseDrawerProps) => {
  // handlers
  const handleSubmit = () => {
    if (!isReviewing) return setIsReviewing(true);
    if (pimaryFunc) {
      console.log('pimaryFunc');
      return pimaryFunc();
    }
  };
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
          <DrawerBody pb="28">{children}</DrawerBody>
          {pimaryFunc && (
            <DrawerFooter borderTop="1px solid #F2F6EA">
              <Flex w="100%" justifyContent="space-between">
                <Button
                  minW="220px"
                  fontSize="15px"
                  onClick={handleSubmit}
                  isLoading={false}
                  loadingText={t('Confirmando')}
                >
                  {isReviewing ? t('Confirmar adiantamento') : t('Revisar adiantamento')}
                </Button>
                {isReviewing && (
                  <Button
                    mr="16"
                    fontSize="15px"
                    variant="outline"
                    onClick={() => setIsReviewing(false)}
                  >
                    {t('Voltar')}
                  </Button>
                )}
              </Flex>
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
