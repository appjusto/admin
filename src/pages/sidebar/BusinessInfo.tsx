import { Box, Circle, Image, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import {
  BusinessSelect,
  BusinessSelectOptions,
} from 'common/components/form/select/BusinessSelect';
import { ImageFbLoading } from 'common/components/ImageFbLoading';
import React from 'react';
import { BusinessStatus } from './BusinessStatus';

const BusinessInfo = () => {
  // context
  const { managerBusinesses } = useContextManagerProfile();
  const { business, setBusinessId } = useContextBusiness();
  const { logo } = useBusinessProfile();
  // state
  const [businesses, setBusinesses] = React.useState<BusinessSelectOptions[]>([]);
  const [selectedBusiness, setSelectedBusiness] = React.useState<BusinessSelectOptions>();
  // handlers
  const handleSwitchBussines = (selected: BusinessSelectOptions) => {
    setSelectedBusiness(selected);
    setBusinessId(selected.value);
  };
  // side effects
  React.useEffect(() => {
    if (!business) return;
    setSelectedBusiness({
      value: business.id,
      label: `${business.name}: ${business.businessAddress?.address ?? 'Não informado'}`,
    });
  }, [business]);
  React.useEffect(() => {
    if (!managerBusinesses) return;
    const businessesList = managerBusinesses.map((business) => ({
      value: business.id,
      label: `${business.name}: ${business.businessAddress?.address ?? 'Não informado'}`,
    }));
    setBusinesses(businessesList);
  }, [managerBusinesses]);
  // UI
  return (
    <Box>
      {business?.logoExists && logo ? (
        <Box w="40px" h="40px">
          <Image
            src={logo}
            borderRadius="20px"
            fallback={<ImageFbLoading w="40px" h="40px" borderRadius="20px" />}
          />
        </Box>
      ) : (
        <Circle size="40px" bg="gray.400" />
      )}
      {managerBusinesses && managerBusinesses.length > 1 ? (
        <Box mt="2" pr="4">
          <BusinessSelect
            options={businesses}
            selected={selectedBusiness}
            onChange={handleSwitchBussines}
          />
        </Box>
      ) : (
        <Text fontSize="md" mt="2">
          {business?.name}
        </Text>
      )}
      <BusinessStatus />
    </Box>
  );
};

export default BusinessInfo;
