import { PlatformManagement } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';

import React from 'react';

export const usePlatformManagement = () => {
  // context
  const api = useContextApi();
  // state
  const [platformManagement, setPlatformManagement] = React.useState<PlatformManagement | null>();
  // side effects
  React.useEffect(() => {
    const unsub = api.platform().observeManagement(setPlatformManagement);
    return () => unsub();
  }, [api]);

  // result
  return { platformManagement };
};
