import { Badge, BadgeProps, Box } from '@chakra-ui/react';
import { AppJustoEnv } from './types';

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

export const EnvBadge = (props: BadgeProps) => {
  // context
  const env = process.env.REACT_APP_ENVIRONMENT as AppJustoEnv;
  // helpers
  const { label, color, bg } = env ? envColors[env] : envColors['live'];
  // UI
  if (env === 'live') {
    return <Box />;
  }
  return (
    <Badge
      mt="1"
      ml="1"
      bg={bg}
      color={color}
      borderRadius="22px"
      px="2"
      size="xs"
      // fontSize="xs"
      // lineHeight="lg"
      fontWeight="700"
      {...props}
    >
      {label}
    </Badge>
  );
};
