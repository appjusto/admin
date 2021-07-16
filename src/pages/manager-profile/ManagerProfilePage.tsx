import { Box } from '@chakra-ui/react';
import { useFirebaseUserRole } from 'app/api/auth/useFirebaseUserRole';
import BankingInformation from 'pages/business-profile/BankingInformation';
import { ManagerProfile } from './ManagerProfile';

const ManagerProfilePage = () => {
  // context
  const { role } = useFirebaseUserRole();
  // UI
  return (
    <Box>
      <ManagerProfile />
      {role === 'manager' && (
        <Box mt="8">
          <BankingInformation />
        </Box>
      )}
    </Box>
  );
};

export default ManagerProfilePage;
