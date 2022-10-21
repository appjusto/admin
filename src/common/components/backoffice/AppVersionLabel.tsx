import { PlatformAccess } from '@appjusto/types';
import { Text } from '@chakra-ui/react';
import { useContextBackofficeDashboard } from 'app/state/dashboards/backoffice';
import { getAppVersionLabelColor } from 'utils/version';

export type AppType = keyof PlatformAccess['currentVersions'];

interface AppVersionLabelProps {
  version?: string;
  type: AppType;
}

export const AppVersionLabel = ({ version, type }: AppVersionLabelProps) => {
  // context
  const { platformAccess } = useContextBackofficeDashboard();
  // helpers
  const current = platformAccess?.currentVersions[type];
  const color = getAppVersionLabelColor(current, version);
  // UI
  return (
    <Text as="span" fontWeight="500" color={color}>
      {version ?? 'N/E'}
    </Text>
  );
};
