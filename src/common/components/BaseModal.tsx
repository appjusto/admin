import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import React from 'react';

interface BaseModalProps extends ModalProps {
  title?: string;
  closeButton?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const BaseModal = ({
  title,
  closeButton = true,
  isOpen,
  onClose,
  children,
  footer,
  ...props
}: BaseModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...props}>
      <ModalOverlay />
      <ModalContent>
        {title && <ModalHeader>{title}</ModalHeader>}
        {closeButton && <ModalCloseButton />}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};
