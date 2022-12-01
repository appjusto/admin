import { Box, Circle, Flex } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessId } from 'app/state/business/context';
import Image from 'common/components/Image';
import { ImageFbLoading } from 'common/components/ImageFbLoading';
import appjustoLogo from 'common/img/logo.svg';
import { useRouteMatch } from 'react-router';
import { BackOfficeLinks } from './BackOfficeLinks';
import { BusinessStatus } from './BusinessStatus';
import { Links } from './Links';
import { ManagerBar } from './ManagerBar';

const Sidebar = () => {
  // context
  const { path } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  const businessId = useContextBusinessId();
  const { logo } = useBusinessProfile(businessId);
  // helpers
  const isBackOffice = path.includes('backoffice');
  const marginTop = isBackofficeUser && !isBackOffice ? 16 : 0;
  // UI
  return (
    <Flex
      position="relative"
      d={{ base: 'none', lg: 'block' }}
      w="220px"
      minW="220px"
      backgroundColor="#EEEEEE"
      flex={0}
    >
      <Box
        position="fixed"
        top={marginTop}
        w="220px"
        h="100vh"
        pb="24"
        overflowY="auto"
      >
        {isBackOffice ? (
          <Flex mt="6" px="4">
            <Box>
              <Image src={appjustoLogo} eagerLoading height="40px" />
            </Box>
          </Flex>
        ) : (
          <Flex mt="6" px="4" justifyContent="space-around" alignItems="center">
            {logo ? (
              <Box w="60px" h="60px">
                <Image
                  src={logo}
                  borderRadius="30px"
                  fallback={
                    <ImageFbLoading w="60px" h="60px" borderRadius="20px" />
                  }
                />
              </Box>
            ) : (
              <Circle size="60px" bg="gray.400" />
            )}
            <Box>
              <Image src={appjustoLogo} eagerLoading height="36px" />
            </Box>
          </Flex>
        )}
        {isBackOffice ? (
          <BackOfficeLinks />
        ) : (
          <Box position="relative">
            <Box ml="4" mt="6">
              <BusinessStatus />
            </Box>
            <Box mt="6">
              <Links />
            </Box>
          </Box>
        )}
        {((!isBackOffice && !isBackofficeUser) ||
          (isBackOffice && isBackofficeUser)) && <ManagerBar />}
      </Box>
    </Flex>
  );
};

export default Sidebar;
