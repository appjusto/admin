import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import React from 'react';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  type: string;
  isEditing: boolean;
  title: string;
  isOpen: boolean;
  onSave(): void;
  onDelete(): void;
  onClose(): void;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<FocusableElement>;
  isLoading: boolean;
}

export const BaseDrawer = ({
  type,
  isEditing,
  title,
  children,
  onSave,
  onClose,
  onDelete,
  isLoading,
  ...props
}: BaseDrawerProps) => {
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{title}</DrawerHeader>
          <DrawerBody>
            {children}
            {!deleteConfirm ? (
              <Stack mt="8" spacing={4} direction="row">
                <Button width="full" maxW="50%" onClick={onSave} isLoading={isLoading}>
                  {t('Salvar')}
                </Button>
                {isEditing && (
                  <Button
                    width="full"
                    variant="dangerLight"
                    ml={3}
                    onClick={() => setDeleteConfirm(true)}
                    isDisabled={isLoading}
                  >
                    {type === 'category' ? t('Apagar categoria') : t('Apagar produto')}
                  </Button>
                )}
              </Stack>
            ) : (
              <Box mt="8" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
                <Text color="red">
                  {t(
                    type === 'category'
                      ? 'Ao apagar a categoria, os itens adicionados a ela também serão excluídos. Tem certeza que deseja excluir essa categoria?'
                      : 'Tem certeza que deseja excluir este produto?'
                  )}
                </Text>
                <Stack mt="8" spacing={4} direction="row">
                  <Button width="full" onClick={() => setDeleteConfirm(false)}>
                    {t(type === 'category' ? 'Manter categoria' : 'Manter produto')}
                  </Button>
                  <Button width="full" variant="danger" onClick={onDelete}>
                    {t(type === 'category' ? 'Apagar categoria' : 'Apagar produto')}
                  </Button>
                </Stack>
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
