import { Box, BoxProps, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import {
  BusinessSelect,
  BusinessSelectOptions,
} from 'common/components/form/select/BusinessSelect';
import React from 'react';

const BusinessInfo = (props: BoxProps) => {
  // context
  const { business, setBusinessId, businesses } = useContextBusiness();
  const { updateLastBusinessId } = useContextManagerProfile();
  // state
  const [managerBusinesses, setManagerBusinesses] = React.useState<
    BusinessSelectOptions[]
  >([]);
  const [selectedBusiness, setSelectedBusiness] =
    React.useState<BusinessSelectOptions>();
  // handlers
  const handleSwitchBussines = (selected: BusinessSelectOptions) => {
    setSelectedBusiness(selected);
    setBusinessId(selected.value);
    updateLastBusinessId(selected.value);
  };
  // side effects
  React.useEffect(() => {
    if (!business) return;
    setSelectedBusiness({
      value: business.id,
      name: business.name ?? 'Sem nome',
      address: business.businessAddress?.address ?? 'Não informado',
    });
  }, [business]);
  React.useEffect(() => {
    if (!businesses) return;
    const businessesList = businesses.map((business) => ({
      value: business.id,
      name: business.name ?? 'Sem nome',
      address: business.businessAddress?.address ?? 'Não informado',
    }));
    setManagerBusinesses(businessesList);
  }, [businesses]);
  // UI
  return (
    <Box {...props}>
      {managerBusinesses.length > 1 ? (
        <Box pr="4" minW={{ md: '250px' }}>
          <BusinessSelect
            options={managerBusinesses}
            selected={selectedBusiness}
            onChange={handleSwitchBussines}
          />
        </Box>
      ) : (
        <Text fontSize="md">{business?.name}</Text>
      )}
    </Box>
  );
};

export default BusinessInfo;
