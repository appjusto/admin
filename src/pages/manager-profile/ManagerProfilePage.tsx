import { Box } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import BankingInformation from 'pages/business-profile/BankingInformation';
import { ManagerProfile } from './ManagerProfile';

const ManagerProfilePage = () => {
  // context
  const { role } = useContextFirebaseUser();
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
