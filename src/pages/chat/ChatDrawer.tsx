import {
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

interface ChatDrawerProps {
  chatId: string;
  isOpen: boolean;
  onClose(): void;
}

export const ChatDrawer = ({ chatId, onClose, ...props }: ChatDrawerProps) => {
  //context

  //handlers

  //UI conditions

  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Flex flexDir="column">
                <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
                  {t('Chat com ')} {'{Participante}'}
                </Text>
                <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
                  {t('ID:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {'000'}
                  </Text>
                </Text>
                <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
                  {t('Atualizado em:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {'00/00/0000 - 00:00'}
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerBody pb="28">BODY</DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <Flex w="full" justifyContent="flex-start">
              <Text>INPUT</Text>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
