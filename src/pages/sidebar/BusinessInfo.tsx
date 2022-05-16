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
  const { business, setBusinessId, businesses } = useContextBusiness();
  const { updateLastBusinessId } = useContextManagerProfile();
  const { logo } = useBusinessProfile();
  // state
  const [managerBusinesses, setManagerBusinesses] = React.useState<BusinessSelectOptions[]>([]);
  const [selectedBusiness, setSelectedBusiness] = React.useState<BusinessSelectOptions>();
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
      label: `${business.name ?? 'Sem nome'}: ${
        business.businessAddress?.address ?? 'Não informado'
      }`,
    });
  }, [business]);
  React.useEffect(() => {
    if (!businesses) return;
    const businessesList = businesses.map((business) => ({
      value: business.id,
      label: `${business.name ?? 'Sem nome'}: ${
        business.businessAddress?.address ?? 'Não informado'
      }`,
    }));
    setManagerBusinesses(businessesList);
  }, [businesses]);
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
      {managerBusinesses.length > 1 ? (
        <Box mt="2" pr="4">
          <BusinessSelect
            options={managerBusinesses}
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
