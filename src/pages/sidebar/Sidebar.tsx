import { Box, Center, Flex, Image, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { ImageFbLoading } from 'common/components/ImageFbLoading';
import appjustoLogo from 'common/img/logo.svg';
import { useRouteMatch } from 'react-router';
import { t } from 'utils/i18n';
import { BackOfficeLinks } from './BackOfficeLinks';
import { BusinessStatus } from './BusinessStatus';
import { Links } from './Links';
import { ManagerBar } from './ManagerBar';

const Sidebar = () => {
  // context
  const { path } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  const { logo } = useContextBusiness();
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
      backgroundColor="#EEEEEE"
    >
      <Box
        position="fixed"
        top={marginTop}
        w="max-content"
        minW="218.24px"
        h="100vh"
        overflowY="auto"
      >
        <Box position="relative" w="fill-available" pb="16">
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
              <Center
                w="60px"
                h="60px"
                bgColor="gray.400"
                borderRadius="30px"
                overflow="hidden"
              >
                {logo ? (
                  <Image
                    src={logo}
                    width="60px"
                    height="60px"
                    fallback={
                      <ImageFbLoading w="60px" h="60px" borderRadius="30px" />
                    }
                  />
                ) : (
                  <Text color="gray.600" fontSize="xs">
                    {t('Logo')}
                  </Text>
                )}
              </Center>
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
