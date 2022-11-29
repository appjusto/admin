import { Badge, Box, Flex } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import Image from 'common/components/Image';
import logo from 'common/img/logo.svg';
import { useRouteMatch } from 'react-router';
import { BackOfficeLinks } from './BackOfficeLinks';
import BusinessInfo from './BusinessInfo';
import { Links } from './Links';
import { ManagerBar } from './ManagerBar';

type Envs = 'community' | 'dev' | 'staging' | 'live';

const envColors = {
  community: {
    label: 'COMMUNITY',
    color: 'white',
    bg: '#78E08F',
  },
  dev: {
    label: 'DEV',
    color: 'white',
    bg: '#DC3545',
  },
  staging: {
    label: 'STAGING',
    color: 'black',
    bg: '#FFBE00',
  },
  live: {
    label: 'LIVE',
    color: '',
    bg: '',
  },
};

const Sidebar = () => {
  // context
  const env = process.env.REACT_APP_ENVIRONMENT as Envs;
  const { path } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  // helpers
  const isBackOffice = path.includes('backoffice');
  const { label, color, bg } = env ? envColors[env] : envColors['live'];
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
        top="4"
        w="220px"
        h="100vh"
        pb="24"
        overflowY="auto"
      >
        <Flex mt="6" px="4" justifyContent="space-between" alignItems="center">
          <Box>
            <Image src={logo} eagerLoading height="40px" />
          </Box>
          {env && env !== 'live' && (
            <Badge
              mt="1"
              ml="1"
              bg={bg}
              color={color}
              borderRadius="22px"
              px="3"
              py="1"
              fontSize="xs"
              lineHeight="lg"
              fontWeight="700"
            >
              {label}
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
        {((!isBackOffice && !isBackofficeUser) ||
          (isBackOffice && isBackofficeUser)) && <ManagerBar />}
      </Box>
    </Flex>
  );
};

export default Sidebar;
