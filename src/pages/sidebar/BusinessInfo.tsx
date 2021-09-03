import { Box, Circle, Image, Select, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { ImageFbLoading } from 'common/components/ImageFbLoading';
import React from 'react';
import { BusinessStatus } from './BusinessStatus';

interface Businesses {
  id: string;
  name?: string;
  address?: string;
}

const BusinessInfo = () => {
  // context
  const { managerBusinesses } = useContextManagerProfile();
  const { business, setBusinessId } = useContextBusiness();
  const { logo } = useBusinessProfile();
  // state
  const [businesses, setBusinesses] = React.useState<Businesses[]>([]);
  const [selectedBusiness, setSelectedBusiness] = React.useState<string>();
  // handlers
  const handleSwitchBussines = (value: string) => {
    setSelectedBusiness(value);
    setBusinessId(value);
  };
  // side effects
  React.useEffect(() => {
    if (!business) return;
    setSelectedBusiness(business.id);
  }, [business]);
  React.useEffect(() => {
    if (!managerBusinesses) return;
    const businessesList = managerBusinesses.map((business) => ({
      id: business.id,
      name: business.name,
      address: business.businessAddress?.address,
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
          <Select
            cursor="pointer"
            value={selectedBusiness}
            onChange={(e) => handleSwitchBussines(e.target.value)}
          >
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {`${business.name} / ${business.address}`}
              </option>
            ))}
          </Select>
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
