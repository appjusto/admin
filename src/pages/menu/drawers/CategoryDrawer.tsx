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
import { Input } from 'common/components/Input';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  id: string;
};

const CategoryDrawer = ({ isOpen, onClose }: Props) => {
  let { id } = useParams<Params>();
  console.log(id);
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <Drawer
      placement="right"
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={inputRef}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t('Adicionar categoria')}</DrawerHeader>

          <DrawerBody>
            <Input
              ref={inputRef}
              label={t('Nova categoria')}
              placeholder={t('Nome da categoria')}
            />
          </DrawerBody>

          <DrawerFooter>
            <Button width="full" color="blue">
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

export default CategoryDrawer;
