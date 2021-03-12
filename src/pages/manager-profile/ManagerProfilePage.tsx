import { Box } from '@chakra-ui/react';
import BankingInformation from 'pages/business-profile/BankingInformation';
import { ManagerProfile } from './ManagerProfile';

const ManagerProfilePage = () => {
  return (
    <Box>
      <ManagerProfile />
      <Box mt="8">
        <BankingInformation />
      </Box>
    </Box>
  );
};

export default ManagerProfilePage;
