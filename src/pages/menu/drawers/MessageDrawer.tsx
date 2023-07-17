import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useMenuMessage } from 'app/api/business/menu/useMenuMessage';
import { useContextStaffProfile } from 'app/state/staff/context';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import React from 'react';
import { t } from 'utils/i18n';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

export const MessageDrawer = ({ onClose, ...props }: Props) => {
  //context
  const { isBackofficeUser } = useContextStaffProfile();
  const {
    menuMessage,
    updateMenuMessage,
    updateMenuMessageResult,
    deleteMenuMessage,
    deleteMenuMessageResult,
  } = useMenuMessage();
  // state
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  // handlers
  const handleSave = () => {
    const newMessage = {
      title,
      description,
    };
    updateMenuMessage(newMessage);
  };
  // side effects
  React.useEffect(() => {
    if (!menuMessage) return;
    setTitle(menuMessage.title);
    setDescription(menuMessage.description);
  }, [menuMessage]);
  React.useEffect(() => {
    if (!deleteMenuMessageResult.isSuccess) return;
    setTitle('');
    setDescription('');
  }, [deleteMenuMessageResult.isSuccess]);
  // UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay
        as="form"
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSave();
        }}
      >
        <DrawerContent pt={isBackofficeUser ? '20' : 0}>
          <DrawerCloseButton
            bg="green.500"
            mr="12px"
            _focus={{ outline: 'none' }}
          />
          <DrawerHeader pb="2">
            <Text fontSize="2xl" fontWeight="700">
              {t('Adicionar mensagem')}
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <Text mb="8">
              {t(
                'Agora você pode adicionar uma mensagem fixa dentro do cardápio para ser exibida como primeiro item acima das categorias.'
              )}
            </Text>
            <Input
              isRequired
              mt="0"
              id="complements-item-name"
              label={t('Título')}
              placeholder={t('Título da mensagem')}
              value={title}
              handleChange={(ev) => setTitle(ev.target.value)}
            />
            <Textarea
              isRequired
              mt="4"
              id="complements-item-description"
              label={t('Mensagem')}
              placeholder={t('Escreva sua mensagem')}
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              maxH="130px"
            />
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <HStack w="100%" spacing={4}>
              <Button
                width="full"
                fontSize="15px"
                type="submit"
                isLoading={updateMenuMessageResult.isLoading}
                loadingText={t('Salvando')}
              >
                {t('Salvar mensagem')}
              </Button>
              <Button
                width="full"
                fontSize="15px"
                variant="dangerLight"
                onClick={() => deleteMenuMessage()}
                isLoading={deleteMenuMessageResult.isLoading}
                loadingText={t('Excluindo')}
              >
                {t('Excluir mensagem')}
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
