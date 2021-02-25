import { Box, Button, HStack, Switch, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { CustomNumberInput } from 'common/components/form/input/CustomNumberInput';
import { ReactComponent as EditIcon } from 'common/img/edit-icon.svg';
import React from 'react';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';

export const OrderAcceptanceBar = () => {
  //context
  const { business } = useOrdersContext();
  const { updateBusinessProfile } = useBusinessProfile();
  const { createFakeOrder } = useOrdersContext();
  //state
  const [minutes, setMinutes] = React.useState<string>('5');
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleOnBlur = () => {
    updateBusinessProfile({ orderAcceptanceTime: parseInt(minutes) });
    setIsEditing(false);
  };

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  React.useEffect(() => {
    if (business?.orderAcceptanceTime) setMinutes(business?.orderAcceptanceTime.toString());
  }, [business?.orderAcceptanceTime]);

  return (
    <HStack mt="6" spacing={4}>
      <Switch
        isChecked={business?.status === 'open'}
        onChange={(ev) => {
          ev.stopPropagation();
          updateBusinessProfile({ status: ev.target.checked ? 'open' : 'closed' });
        }}
      />
      <Text minW="260px">{t('Aceitar pedidos automaticamente:')}</Text>
      {isEditing ? (
        <Box maxW="120px">
          <CustomNumberInput
            ref={inputRef}
            mt="0"
            maxW="120px"
            maxH="50px"
            id="order-minutes"
            label={t('Editar minutos')}
            value={minutes}
            onChange={(ev) => setMinutes(ev.target.value)}
            onBlur={handleOnBlur}
            maxLength={2}
          />
        </Box>
      ) : (
        <Button
          variant="outline"
          size="sm"
          borderColor="#F2F6EA"
          fontWeight="700"
          color="black"
          onClick={() => setIsEditing(true)}
        >
          <EditIcon style={{ borderBottom: '1px solid black' }} />
          <Text ml="4">
            {minutes} {t('minutos')}
          </Text>
        </Button>
      )}
      <Button onClick={createFakeOrder}>Criar Ordem</Button>
    </HStack>
  );
};
