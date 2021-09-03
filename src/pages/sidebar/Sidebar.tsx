import { Badge, Box, Flex } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import Image from 'common/components/Image';
import logo from 'common/img/logo.svg';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { BackOfficeLinks } from './BackOfficeLinks';
import BusinessInfo from './BusinessInfo';
import { Links } from './Links';
import { ManagerBar } from './ManagerBar';

const Sidebar = () => {
  // context
  const env = process.env.REACT_APP_ENVIRONMENT;
  const { path } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  const isBackOffice = path.includes('backoffice');
  return (
    <Box
      position="relative"
      d={{ base: 'none', md: 'block' }}
      w="220px"
      minW="220px"
      backgroundColor="gray.300"
      flexShrink={0}
    >
      <Box position="fixed" top="4" w="220px" h="100vh" pb="24" overflowY="auto">
        <Flex mt="6" px="4" justifyContent="space-between" alignItems="center">
          <Box>
            <Image src={logo} eagerLoading height="40px" />
          </Box>
          {env && env !== 'live' && (
            <Badge
              mt="1"
              bg={env === 'staging' ? '#FFBE00' : '#DC3545'}
              color={env === 'dev' ? 'white' : 'black'}
              borderRadius="22px"
              px="3"
              py="1"
              fontSize="xs"
              lineHeight="lg"
              fontWeight="700"
            >
              {env === 'staging' ? 'STAGING' : 'DEV'}
            </Badge>
          )}
        </Flex>
        {isBackOffice ? (
          <BackOfficeLinks />
        ) : (
          <Box position="relative">
            <Box ml="4" mt="6">
              <BusinessInfo />
            </Box>
            <Box mt="6">
              <Links />
            </Box>
          </Box>
        )}
      </Box>
      {((!isBackOffice && !isBackofficeUser) || (isBackOffice && isBackofficeUser)) && (
        <ManagerBar />
      )}
    </Box>
  );
};

export default Sidebar;
