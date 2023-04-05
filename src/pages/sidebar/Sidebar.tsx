import { Box, Circle, Flex, Image } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessId } from 'app/state/business/context';
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
  const marginTop = isBackofficeUser && !isBackOffice ? 20 : 0;
  // UI
  return (
    <Flex
      position="relative"
      display={{ base: 'none', lg: 'block' }}
      w={{ lg: '22%', xl: '15.27%' }}
      minW="218.24px"
      maxW="220px"
    >
      <Box
        position="fixed"
        top={marginTop}
        w="max-content"
        minW="218.24px"
        h="100vh"
        backgroundColor="#EEEEEE"
      >
        <Box w="fill-available" pb="24" overflowY="auto">
          {isBackOffice ? (
            <Flex mt="6" px="4">
              <Box>
                <Image src={appjustoLogo} height="40px" />
              </Box>
            </Flex>
          ) : (
            <Flex
              mt="4"
              px="4"
              justifyContent="space-around"
              alignItems="center"
            >
              {logo ? (
                <Box w="60px" h="60px">
                  <Image
                    src={logo}
                    borderRadius="30px"
                    fallback={
                      <ImageFbLoading w="60px" h="60px" borderRadius="30px" />
                    }
                  />
                </Box>
              ) : (
                <Circle size="60px" bg="gray.400" />
              )}
              <Box>
                <Image src={appjustoLogo} height="36px" />
              </Box>
            </Flex>
          )}
          {isBackOffice ? (
            <BackOfficeLinks />
          ) : (
            <Box position="relative">
              <Box ml="3" mt="6">
                <BusinessStatus />
              </Box>
              <Box mt="6">
                <Links />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {((!isBackOffice && !isBackofficeUser) ||
        (isBackOffice && isBackofficeUser)) && <ManagerBar />}
    </Flex>
  );
};

export default Sidebar;
