import { PlatformAccess } from '@appjusto/types';
import { Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { getAppVersionLabelColor } from 'utils/version';

export type AppType = keyof PlatformAccess['currentVersions'];

interface AppVersionLabelProps {
  version?: string;
  type: AppType;
}

export const AppVersionLabel = ({ version, type }: AppVersionLabelProps) => {
  // context
  const { platformAccess } = useContextFirebaseUser();
  // helpers
  const current = platformAccess?.currentVersions
    ? platformAccess?.currentVersions[type]
    : null;
  const color = getAppVersionLabelColor(current, version);
  // UI
  return (
    <Text as="span" fontWeight="500" color={color}>
      {version ?? 'N/E'}
    </Text>
  );
};
