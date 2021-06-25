import { Box, Flex, Switch, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import React from 'react';
import { t } from 'utils/i18n';

export const PrintSwitch = () => {
  // context
  const { business, updateContextBusinessOrderPrint } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  const { isError, error: updateError } = updateResult;

  //state
  const [enable, setEnable] = React.useState(false);
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);

  //handlers
  const handleEnable = (status: boolean) => {
    submission.current += 1;
    setEnable(status);
    updateContextBusinessOrderPrint(status);
    updateBusinessProfile({ orderPrinting: status });
  };

  //side effects
  React.useEffect(() => {
    if (!business) return;
    setEnable(business.orderPrinting ?? false);
  }, [business]);

  React.useEffect(() => {
    if (isError)
      setError({
        status: true,
        error: updateError,
      });
  }, [isError, updateError]);

  //UI
  return (
    <Box>
      <Flex mt="10" flexDir="row">
        <Switch
          isChecked={enable}
          onChange={(ev) => {
            ev.stopPropagation();
            handleEnable(ev.target.checked);
          }}
        />
        <Text ml="4" fontSize="xl" color="black">
          {t('Imprimir ao confirmar')}
        </Text>
      </Flex>
      <SuccessAndErrorHandler
        submission={submission.current}
        isError={error.status}
        error={error.error}
      />
    </Box>
  );
};
