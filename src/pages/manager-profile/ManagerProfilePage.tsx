import { Box } from '@chakra-ui/react';
import BankingInformation from 'pages/business-profile/BankingInformation';
import { ManagerProfile } from './ManagerProfile';

export const ManagerProfilePage = () => {
  return (
    <Box>
      <ManagerProfile />
      <Box mt="8">
        <BankingInformation />
      </Box>
    </Box>
  );
};
