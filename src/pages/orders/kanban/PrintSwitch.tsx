import { Box, Flex, Switch, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { t } from 'utils/i18n';

export const PrintSwitch = () => {
  // context
  const { business, updateContextBusinessOrderPrint } = useContextBusiness();
  const { updateBusinessProfile } = useBusinessProfile();
  //state
  const [enable, setEnable] = React.useState(false);
  //handlers
  const handleEnable = (status: boolean) => {
    setEnable(status);
    updateContextBusinessOrderPrint(status);
    updateBusinessProfile({ orderPrinting: status });
  };
  //side effects
  React.useEffect(() => {
    if (!business) return;
    setEnable(business.orderPrinting ?? false);
  }, [business]);
  //UI
  return (
    <Box>
      <Flex mt="4" flexDir="row" alignItems="center">
        <Switch
          isChecked={enable}
          onChange={(ev) => {
            ev.stopPropagation();
            handleEnable(ev.target.checked);
          }}
        />
        <Text ml="2" fontSize="md" color="black">
          {t('Imprimir pedidos ao confirmar')}
        </Text>
      </Flex>
    </Box>
  );
};
