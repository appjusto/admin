import { Badge, Flex, HStack, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import packageInfo from '../../package.json';
import BusinessInfo from './sidebar/BusinessInfo';
const version = packageInfo.version;

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

const MainHeader = () => {
  // context
  const env = process.env.REACT_APP_ENVIRONMENT as Envs;
  // helpers
  const { label, color, bg } = env ? envColors[env] : envColors['live'];
  // UI
  return (
    <Flex justifyContent="space-between" alignItems="flex-start">
      <BusinessInfo />
      <HStack>
        <Text
          mt="4"
          fontSize="11px"
          lineHeight="18px"
          fontWeight="700"
          letterSpacing="0.6px"
        >
          {t(`VERSÃO: ${version ?? 'N/E'}`)}
        </Text>
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
      </HStack>
    </Flex>
  );
};

export default MainHeader;
