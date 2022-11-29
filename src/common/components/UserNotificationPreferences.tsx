import { NotificationPreferences } from '@appjusto/types';
import { Box, Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';

interface NotificationPreferencesProps {
  notificationPreferences?: NotificationPreferences;
  handlePreferenciesChange(preferencies: NotificationPreferences): void;
}

const fixedNotifications = [
  'order-update',
  'order-chat',
] as NotificationPreferences;

export const UserNotificationPreferences = ({
  notificationPreferences,
  handlePreferenciesChange,
}: NotificationPreferencesProps) => {
  // handlers
  const handleChange = (values: NotificationPreferences) => {
    const editables = values.filter(
      (value) => !fixedNotifications.includes(value)
    );
    const changes = [
      ...editables,
      ...fixedNotifications,
    ] as NotificationPreferences;
    handlePreferenciesChange(changes);
  };
  // UI
  return (
    <CheckboxGroup
      colorScheme="green"
      value={notificationPreferences}
      onChange={(values: NotificationPreferences) => handleChange(values)}
    >
      <Stack
        mt="6"
        alignItems="flex-start"
        color="black"
        spacing={4}
        fontSize="16px"
        lineHeight="22px"
      >
        <Box>
          <Checkbox value="status">{t('Comunicações operacionais')}</Checkbox>
          <Text fontSize="13px">
            {t('Para saber sobre novas versões, atualizações do app e mais.')}
          </Text>
        </Box>
        <Box>
          <Checkbox value="general">
            {t('Comunicações institucionais')}
          </Checkbox>
          <Text fontSize="13px">
            {t(
              'Para conhecer mais sobre o AppJusto: propósito, impacto, crescimento, financiamento e mais.'
            )}
          </Text>
        </Box>
        <Box>
          <Checkbox value="marketing">{t('Promoções e ofertas')}</Checkbox>
          <Text fontSize="13px">
            {t(
              'Avisar sobre promoções e ofertas referentes aos restaurantes da rede.'
            )}
          </Text>
        </Box>
      </Stack>
    </CheckboxGroup>
  );
};
