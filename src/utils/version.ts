import packageInfo from '../../package.json';

const version = packageInfo.version;

export const isAppVersionAllowed = (
  minVersion: string,
  appVersion?: string
) => {
  if (appVersion) {
    const valueToCompare = appVersion.includes(' / ')
      ? appVersion.split(' / ')[1]
      : appVersion;
    return (
      valueToCompare.localeCompare(minVersion, undefined, {
        numeric: true,
        sensitivity: 'base',
      }) >= 0
    );
  }
  return (
    version.localeCompare(minVersion, undefined, {
      numeric: true,
      sensitivity: 'base',
    }) >= 0
  );
};

export const getAppVersionLabelColor = (
  minVersion?: string | null,
  appVersion?: string | null
) => {
  let color = 'black';
  if (minVersion && appVersion) {
    if (!isAppVersionAllowed(minVersion, appVersion)) color = 'red';
  }
  return color;
};
