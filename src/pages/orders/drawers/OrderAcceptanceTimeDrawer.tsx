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
  Switch,
  Text,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useOrdersContext } from 'app/state/order';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { ItemsQtdButtons } from 'pages/menu/drawers/product/groups/ItemQtdButtons';
import React from 'react';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const OrderAcceptanceTimeDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { business } = useOrdersContext();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  const { isLoading, isSuccess, isError, error: updateError } = updateResult;

  //state
  const [minutes, setMinutes] = React.useState(5);
  const [acceptanceOn, setAcceptanceOn] = React.useState(false);
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);

  // handlers
  const handleSave = async () => {
    submission.current += 1;
    setError(initialError);
    await updateBusinessProfile({ orderAcceptanceTime: acceptanceOn ? minutes * 60 : null });
  };

  // side effects
  React.useEffect(() => {
    if (business?.orderAcceptanceTime) {
      setAcceptanceOn(true);
      setMinutes(business?.orderAcceptanceTime / 60);
    }
  }, [business?.orderAcceptanceTime]);

  React.useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);

  React.useEffect(() => {
    if (isError) {
      setError({
        status: true,
        error: updateError,
      });
    }
  }, [isError, updateError]);

  // UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {t('Aceitar pedidos automaticamente')}
            </Text>
          </DrawerHeader>
          <DrawerBody maxH="140px">
            <Text fontSize="sm" lineHeight="26px" mb="2" maxW="540px">
              {t(
                'Determine em quantos minutos seus pedidos devam ser aceitos automaticamente caso você não os mova para "Em preparação".'
              )}
            </Text>
            <Flex mt="6" alignItems="center">
              <Switch
                isChecked={acceptanceOn}
                onChange={(ev) => {
                  ev.stopPropagation();
                  setAcceptanceOn(!acceptanceOn);
                }}
              />
              <Text ml="4" color="black" fontSize="xs" lineHeight="21px">
                {t('Aceitar pedidos automaticamente')}
              </Text>
            </Flex>
          </DrawerBody>
          <DrawerFooter border="1px solid #F2F6EA">
            <Flex w="full" justifyContent="space-between" alignItems="center">
              <ItemsQtdButtons
                value={minutes}
                increment={() => setMinutes((prev) => prev + 1)}
                decrement={() => setMinutes((prev) => (prev > 0 ? prev - 1 : 0))}
              />
              {acceptanceOn && (
                <Text fontSize="xs" lineHeight="21px">
                  {t(`Seus pedidos serão aceitos em ${minutes} minutos`)}
                </Text>
              )}
              <Button
                maxW="200px"
                isLoading={isLoading}
                loadingText={t('Salvando')}
                onClick={handleSave}
              >
                {t('Salvar alterações')}
              </Button>
            </Flex>
          </DrawerFooter>
          <SuccessAndErrorHandler
            submission={submission.current}
            isError={error.status}
            error={error.error}
            errorMessage={error.message}
          />
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
